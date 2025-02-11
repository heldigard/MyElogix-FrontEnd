import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../../../shared/infrastructure/auth/auth-interceptor.service';
import { ErrorNotifierService } from './error/error-notifier.service';
import { LoaderInterceptorService } from './loader/loader-interceptor.service';
import { RetryInterceptorService } from './retry/retry-interceptor.service';

export const interceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptorService,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorNotifierService,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RetryInterceptorService,
    multi: true,
  },
];
