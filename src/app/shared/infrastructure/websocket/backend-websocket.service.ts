import {
  Injectable,
  OnDestroy,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { Client } from '@stomp/stompjs';

declare const SockJS: any;

@Injectable({
  providedIn: 'root',
})
export class BackendWebSocketService implements OnDestroy {
  // Signal-based connection state
  private isConnectedSignal = signal<boolean>(false);
  public isConnected = computed(() => this.isConnectedSignal());
  private stompClient: Client | null = null;
  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();
  private messageSubjects: Map<string, Subject<any>> = new Map();
  private destroyed$ = new Subject<void>();
  private reconnectInterval: any;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly cookieService: CookieService = inject(CookieService);

  // Track active topic subscribers to optimize connection lifecycle
  private activeTopicSubscribers = signal<Set<string>>(new Set());

  constructor() {
    // Connection management effect - connect when we have subscribers, disconnect when none
    effect(() => {
      const topics = this.activeTopicSubscribers();
      if (topics.size > 0 && !this.stompClient?.connected) {
        this.initializeConnection();
      } else if (topics.size === 0 && this.stompClient?.connected) {
        // Optional: Auto-disconnect when no active subscribers
        this.disconnect();
      }
    });
  }

  /**
   * Initialize the WebSocket connection if authenticated
   */
  public initializeConnection(): void {
    // Check if already connected
    if (this.stompClient?.connected) return;

    // Check if access token exists before attempting connection
    const token = this.getAccessToken();
    if (!token) {
      console.log('No access token available, skipping WebSocket connection');
      return;
    }

    this.connect();
  }

  /**
   * Connect to the WebSocket server with authentication token
   */
  private connect(): void {
    if (this.stompClient) {
      this.disconnect();
    }

    const token = this.getAccessToken();
    if (!token) return;

    try {
      // Use dynamic import to avoid direct reference that causes the global error
      this.stompClient = new Client({
        webSocketFactory: () =>
          new SockJS(environment.WS_URL, null, {
            transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        debug: environment.production ? () => {} : console.log,
        onConnect: () => this.onConnect(),
        onStompError: (error) => this.onError(error),
        reconnectDelay: 5000,
      });

      this.stompClient.activate();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.handleReconnect();
    }
  }

  /**
   * Subscribe to a specific WebSocket topic with type information
   */
  public subscribeWithType<T>(topic: string): Observable<T> {
    return this.subscribe(topic) as Observable<T>;
  }

  /**
   * Subscribe to a specific WebSocket topic
   */
  public subscribe(topic: string): Observable<any> {
    // Track active subscribers
    this.activeTopicSubscribers.update((topics) => {
      const newTopics = new Set(topics);
      newTopics.add(topic);
      return newTopics;
    });

    if (!this.messageSubjects.has(topic)) {
      this.messageSubjects.set(topic, new Subject<any>());

      // If already connected, subscribe immediately
      if (this.stompClient && this.stompClient.connected) {
        this.stompSubscribe(topic);
      }
      // Otherwise it will be subscribed when connection is established
    }

    // Add automatic cleanup when component using the subscription is destroyed
    return this.messageSubjects
      .get(topic)!
      .asObservable()
      .pipe(takeUntil(this.destroyed$));
  }

  /**
   * Unsubscribe from a specific topic
   */
  public unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }

    const subject = this.messageSubjects.get(topic);
    if (subject) {
      this.messageSubjects.delete(topic);
    }

    // Update active subscribers tracking
    this.activeTopicSubscribers.update((topics) => {
      const newTopics = new Set(topics);
      newTopics.delete(topic);
      return newTopics;
    });
  }

  // Update your connection status management
  private onConnect(): void {
    this.reconnectAttempts = 0;
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    console.log('WebSocket connected');
    this.isConnectedSignal.set(true);

    // Resubscribe to all previous topics
    this.messageSubjects.forEach((_, topic) => {
      this.stompSubscribe(topic);
    });
  }

  private onError(error: any): void {
    console.error('WebSocket connection error:', error);
    this.isConnectedSignal.set(false);
    this.handleReconnect();
  }

  /**
   * Get the JWT access token from cookie
   */
  private getAccessToken(): string | null {
    return this.cookieService.get('accessToken') || null;
  }

  /**
   * Handle reconnection logic with backoff
   */
  private handleReconnect(): void {
    if (this.reconnectInterval) {
      return; // Already trying to reconnect
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(
        `Exceeded maximum reconnection attempts (${this.maxReconnectAttempts})`,
      );
      return;
    }

    this.reconnectInterval = setInterval(() => {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
      );

      const token = this.getAccessToken();
      if (token) {
        this.connect();
      } else {
        console.log('No token available for reconnection, will try again');
      }

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    }, 5000); // Try every 5 seconds
  }

  /**
   * Create a STOMP subscription to a topic
   */
  private stompSubscribe(topic: string): void {
    if (!this.stompClient || !this.stompClient.connected) return;

    if (this.subscriptions.has(topic)) {
      return; // Already subscribed
    }

    const subscription = this.stompClient.subscribe(topic, (message: any) => {
      if (message.body) {
        const messageSubject = this.messageSubjects.get(topic);
        if (messageSubject) {
          try {
            const parsedBody = JSON.parse(message.body);
            messageSubject.next(parsedBody);
          } catch (e) {
            console.warn(`Error parsing message from topic ${topic}:`, e);
            // Still forward the raw message
            messageSubject.next(message.body);
          }
        }
      }
    });

    this.subscriptions.set(topic, subscription);
  }

  /**
   * Disconnect the WebSocket connection
   */
  public disconnect(): void {
    if (this.stompClient) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // Deactivate the client
      this.stompClient.deactivate();
      this.stompClient = null;
      this.isConnectedSignal.set(false);
    }
  }

  /**
   * Clean up resources when service is destroyed
   */
  ngOnDestroy(): void {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }

    this.disconnect();

    this.messageSubjects.forEach((subject) => {
      subject.complete();
    });
    this.messageSubjects.clear();

    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
