export interface GenericProductionWebSocketMessage<T> {
  id: number;
  data: T;
  status: string;
  message: string;
  timestamp: string; // ISO date string from Instant.now()
}
