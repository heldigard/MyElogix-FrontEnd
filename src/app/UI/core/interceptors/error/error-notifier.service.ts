import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationImplService } from '../../../../shared/infrastructure/auth/authentication-impl.service';
@Injectable({
  providedIn: 'root',
})
export class ErrorNotifierService implements HttpInterceptor {
  private toastrService: ToastrService = inject(ToastrService);
  private _authenticationImplService: AuthenticationImplService = inject(
    AuthenticationImplService,
  );
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (!req.url.includes('/auth/') && error.status === 401) {
            return this._authenticationImplService.handle401Error(req, next);
          }
          if (
            !req.url.includes('/live/ready') &&
            !req.url.includes('/auth/logout') &&
            !req.url.includes('/delete/')
          ) {
            this.toastrService.error(error.message, error.name, {
              closeButton: true,
              progressBar: true,
              timeOut: 3000,
            });
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
