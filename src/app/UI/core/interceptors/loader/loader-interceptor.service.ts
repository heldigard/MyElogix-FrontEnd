import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../../../modules/loader/loader.service';

@Injectable({
  providedIn: 'root',
})
export class LoaderInterceptorService implements HttpInterceptor {
  private activeRequests = 0;
  private loaderService: LoaderService = inject(LoaderService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Verifica si debemos mostrar el loader para esta petición
    if (this.shouldShowLoader(request)) {
      this.showLoader();
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (this.shouldShowLoader(request)) {
          this.hideLoader();
        }
      }),
    );
  }

  private shouldShowLoader(request: HttpRequest<any>): boolean {
    // Agrega logging para debug
    // console.log('Checking request:', request.url);
    const shouldShow = !(
      request.url.includes('/hits') ||
      request.url.includes('/pagination') ||
      request.url.includes('/find/status') ||
      request.url.includes('/find/billing') ||
      request.url.includes('/find/all')
    );
    // console.log('Should show loader:', shouldShow);
    return shouldShow;
  }

  private showLoader(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.loaderService.show();
    }
  }

  private hideLoader(): void {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.loaderService.hide();
    }
  }
}
