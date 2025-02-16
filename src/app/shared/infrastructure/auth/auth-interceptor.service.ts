import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { AuthenticationImplService } from './authentication-impl.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  // Remove the local refreshTokenInProgress signal and use the one from AuthenticationImplService
  private readonly pendingRequests = signal<
    Array<{ request: HttpRequest<any>; next: HttpHandler }>
  >([]);
  private readonly authImplService = inject(AuthenticationImplService);
  private readonly cookieService = inject(CookieService);

  // Cache properties
  private readonly REFRESH_TOKEN_THRESHOLD = 60 * 60 * 1000; // 60 minutes
  private tokenExpirationTime: number | null = null;
  private lastTokenCheck: number = 0;
  private readonly TOKEN_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Skip auth header for auth routes
    if (!request.url.includes('/auth/')) {
      request = this.addAuthHeader(request);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Skip refresh token for auth routes to avoid infinite loops
          if (request.url.includes('/auth/')) {
            return throwError(() => error);
          }

          if (this.authImplService.refreshTokenInProgress()) {
            // Store the request to retry later
            const currentRequests = this.pendingRequests();
            this.pendingRequests.set([...currentRequests, { request, next }]);

            // Wait for refresh token completion
            return toObservable(this.authImplService.refreshTokenSignal).pipe(
              switchMap((token) => {
                if (token) {
                  const newRequest = this.addAuthHeader(request);
                  return next.handle(newRequest);
                }
                // If no token, force logout
                this.authImplService.logout();
                return throwError(() => new Error('Authentication required'));
              }),
            );
          }

          return this.handleRefreshToken(request, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handleRefreshToken(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.authImplService.handle401Error(request, next).pipe(
      tap(() => {
        this.resetTokenCache();
        // Retry pending requests with new token
        const pendingReqs = this.pendingRequests();
        pendingReqs.forEach(({ request, next }) => {
          const newRequest = this.addAuthHeader(request);
          next.handle(newRequest).subscribe({
            error: () => {
              this.authImplService.logout();
            },
          });
        });
        this.pendingRequests.set([]);
      }),
      catchError((err) => {
        this.pendingRequests.set([]);
        this.authImplService.logout();
        return throwError(() => err);
      }),
    );
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    // Check token expiration before adding header
    if (
      this.checkTokenExpiration() &&
      !this.authImplService.refreshTokenInProgress()
    ) {
      // Instead of handling refresh here, we'll let the 401 interceptor handle it
      // This avoids potential race conditions and unnecessary logout
      const token = this.cookieService.get('accessToken');
      return request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    const token = this.cookieService.get('accessToken');
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  private checkTokenExpiration(): boolean {
    const now = Date.now();

    // Usar caché si está disponible y es reciente
    if (
      now - this.lastTokenCheck < this.TOKEN_CHECK_INTERVAL &&
      this.tokenExpirationTime
    ) {
      return now >= this.tokenExpirationTime - this.REFRESH_TOKEN_THRESHOLD;
    }

    try {
      const token = this.cookieService.get('accessToken');
      if (!token) return false; // Cambiar a false para evitar ciclos

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.tokenExpirationTime = tokenPayload.exp * 1000;
      this.lastTokenCheck = now;

      return now >= this.tokenExpirationTime - this.REFRESH_TOKEN_THRESHOLD;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return false; // Cambiar a false para evitar ciclos
    }
  }

  public resetTokenCache(): void {
    this.tokenExpirationTime = null;
    this.lastTokenCheck = 0;
  }
}
