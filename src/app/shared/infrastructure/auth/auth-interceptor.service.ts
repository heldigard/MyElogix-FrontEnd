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
  private readonly refreshTokenInProgress = signal<boolean>(false);
  private readonly pendingRequests = signal<
    Array<{
      request: HttpRequest<any>;
      next: HttpHandler;
    }>
  >([]);

  private readonly authImplService = inject(AuthenticationImplService);
  private readonly cookieService = inject(CookieService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this.isWithToken(request) || this.authImplService.getIsLoggedIn()) {
      request = this.addAuthHeader(request);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (this.refreshTokenInProgress()) {
            const currentRequests = this.pendingRequests();
            this.pendingRequests.set([...currentRequests, { request, next }]);

            // Usar toObservable correctamente
            return toObservable(this.authImplService.refreshTokenSignal).pipe(
              switchMap((token) => {
                if (token) {
                  const newRequest = this.addAuthHeader(request);
                  return next.handle(newRequest);
                }
                return throwError(() => new Error('Token refresh failed'));
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
    this.refreshTokenInProgress.set(true);

    return this.authImplService.handle401Error(request, next).pipe(
      tap(() => {
        this.refreshTokenInProgress.set(false);
        // Reintenta todas las peticiones pendientes
        const pendingReqs = this.pendingRequests();
        pendingReqs.forEach(({ request, next }) => {
          const newRequest = this.addAuthHeader(request);
          next.handle(newRequest).subscribe();
        });
        this.pendingRequests.set([]);
      }),
      catchError((err) => {
        this.refreshTokenInProgress.set(false);
        this.pendingRequests.set([]);
        return throwError(() => err);
      }),
    );
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.cookieService.get('accessToken');
    if (!token) {
      return request;
    }

    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  private isWithToken(request: HttpRequest<any>): boolean {
    return !request.url.includes('/auth/');
  }
}
