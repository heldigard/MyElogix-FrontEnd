import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, retry, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RetryInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(retry({ count: retryCount, delay: this.shouldRetry }));
  }

  shouldRetry(error: HttpErrorResponse) {
    if (error.status >= 500 || error.status === 0) {
      return timer(retryWaitMilliSeconds);
    }
    throw error;
  }
}

export const retryCount = 5;
export const retryWaitMilliSeconds = 3000;
