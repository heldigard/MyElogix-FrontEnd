import {
  HttpClient,
  HttpHandler,
  HttpRequest,
  type HttpEvent,
} from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ROLES_ADMIN,
  ROLES_BILLING,
  ROLES_COMMERCIAL,
  ROLES_DISPATCH,
  ROLES_MANAGER,
  ROLES_PRODUCTION,
  TOKEN_EXPIRATION_TIME,
  TOKEN_REFRESH_EXPIRATION_TIME,
  URL_AUTH,
  URL_AUTH_LOGIN,
} from '@globals';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import {
  catchError,
  lastValueFrom,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CryptoService } from '../../../UI/shared/services/crypto.service';
import { AuthenticationRequest } from '../../domain/models/auth/AuthenticationRequest';
import { AuthenticationResponse } from '../../domain/models/auth/AuthenticationResponse';
import { LogoutRequest } from '../../domain/models/auth/LogoutRequest';
import { RefreshRequest } from '../../domain/models/auth/RefreshRequest';
import { UserDTO } from '../../domain/models/auth/UserDTO';
import { toObservable } from '@angular/core/rxjs-interop';
import type { DecodedToken } from '../../domain/models/auth/DecodedToken';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationImplService {
  private readonly apiURL = environment.apiURL + environment.apiVersion;
  private readonly localEndpoint = '/auth';

  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);
  private readonly cookieService: CookieService = inject(CookieService);
  private readonly cryptoService: CryptoService = inject(CryptoService);

  // Inicializar signals con valores por defecto
  private readonly isLoggedIn = signal<boolean>(false);
  private readonly currentUser = signal<UserDTO>(this.getBlank());
  // Make refreshTokenInProgress accessible
  public readonly refreshTokenInProgress = signal<boolean>(false);
  public readonly refreshTokenSignal = signal<AuthenticationResponse | null>(
    null,
  );
  private readonly isLoggingNow = signal<boolean>(false);

  constructor() {
    // Mover la verificación del token al constructor
    this.isLoggedIn.set(this.cookieService.check('accessToken'));
    if (this.isLoggedIn()) {
      this.initUser();
    }
  }

  authenticate(
    authenticationRequest: AuthenticationRequest,
  ): Observable<AuthenticationResponse> {
    const endpoint = this.localEndpoint + '/authenticate';
    return this.httpClient.post<AuthenticationResponse>(
      this.apiURL + endpoint,
      authenticationRequest,
    );
  }

  refresh(refreshRequest: RefreshRequest): Observable<AuthenticationResponse> {
    const endpoint = this.localEndpoint + '/refresh';
    return this.httpClient.post<AuthenticationResponse>(
      this.apiURL + endpoint,
      refreshRequest,
    );
  }

  // Modificar login para usar signals
  public login(response: AuthenticationResponse) {
    this.setCookie('accessToken', response.accessToken);
    this.setCookie('refreshToken', response.refreshToken);

    const tokenDecoded = this.cryptoService.decodeToken(response.accessToken);
    this.setCurrentUser(tokenDecoded);
    this.isLoggedIn.set(true);
    this.isLoggingNow.set(false);
  }

  // Modificar logout para usar signals
  public logout(): void {
    if (this.isLoggedIn()) {
      this.logout_promise()
        .then((r) => console.log('logout', r))
        .catch();
      this.resetCurrentUser();
      this.clearCookies();
      this.isLoggedIn.set(false);
      this.refreshTokenSignal.set(null);
      this.navigateToLogin();
    }
  }

  logout_promise(): Promise<boolean> {
    return lastValueFrom(this.logout_request());
  }

  logout_request(): Observable<boolean> {
    const endpoint = this.localEndpoint + '/logout';
    const user = this.currentUser();
    const accessToken = this.cookieService.get('accessToken');

    if (!user || !accessToken) {
      this.clearCookies();
      this.resetCurrentUser();
      return throwError(() => 'No user or token available');
    }

    const logoutRequest: LogoutRequest = {
      username: user.username ?? '',
      accessToken: accessToken,
    };

    return this.httpClient
      .post<boolean>(this.apiURL + endpoint, logoutRequest)
      .pipe(
        catchError((error) => {
          console.error('Logout error:', error);
          this.clearCookies();
          this.resetCurrentUser();
          return throwError(() => new Error('Error during logout'));
        }),
      );
  }

  // Modify handle401Error to handle token refresh

  handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress()) {
      this.refreshTokenInProgress.set(true);
      this.refreshTokenSignal.set(null);

      const refreshToken = this.cookieService.get('refreshToken');

      if (!refreshToken) {
        this.refreshTokenInProgress.set(false);
        this.logout();
        return throwError(() => new Error('No refresh token available'));
      }

      return this.refresh({ refreshToken }).pipe(
        switchMap((response: AuthenticationResponse) => {
          this.refreshTokenInProgress.set(false);
          this.refreshTokenSignal.set(response);
          this.login(response);
          return next.handle(this.addToken(request, response.accessToken));
        }),
        catchError((error) => {
          this.refreshTokenInProgress.set(false);
          this.refreshTokenSignal.set(null);
          this.logout();
          return throwError(() => new Error('Token refresh failed'));
        }),
      );
    }

    // Wait for the ongoing refresh to complete
    return new Observable<HttpEvent<any>>((subscriber) => {
      const intervalId = setInterval(() => {
        if (!this.refreshTokenInProgress()) {
          clearInterval(intervalId);

          const token = this.cookieService.get('accessToken');
          if (token) {
            next.handle(this.addToken(request, token)).subscribe(subscriber);
          } else {
            this.logout();
            subscriber.error(new Error('Authentication required'));
          }
        }
      }, 100);

      // Cleanup
      return () => clearInterval(intervalId);
    });
  }

  // Helper method to add token to request
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  public initUser(): void {
    if (this.cookieService.check('accessToken')) {
      try {
        const token = this.cookieService.get('accessToken');
        const tokenDecoded = this.cryptoService.decodeToken(token);
        this.setCurrentUser(tokenDecoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout(); // Esto limpiará todo y redirigirá al login
      }
    } else {
      this.resetCurrentUser();
      this.navigateToLogin(); // Agregar redirección explícita
    }
  }

  public getBlank(): UserDTO {
    return {
      id: -1,
      username: '',
      firstName: '',
      lastName: '',
      isActive: false,
      isLocked: false,
      isDeleted: false,
      roles: new Set<string>([]),
    };
  }

  public setCookie(name: string, value: string) {
    const expirationTime =
      name === 'refreshToken'
        ? TOKEN_REFRESH_EXPIRATION_TIME
        : TOKEN_EXPIRATION_TIME;

    const options: CookieOptions = {
      path: '/',
      sameSite: 'Strict',
      expires: new Date(Date.now() + expirationTime),
      secure: true, // Para HTTPS
    };

    this.cookieService.set(name, value, options);
  }

  public setCurrentUser(tokenDecoded: DecodedToken): UserDTO {
    const user: UserDTO = {
      id: tokenDecoded.id,
      username: tokenDecoded.sub,
      firstName: tokenDecoded.firstName,
      lastName: tokenDecoded.lastName,
      isActive: tokenDecoded.isActive,
      isLocked: tokenDecoded.isLocked,
      isDeleted: tokenDecoded.isDeleted,
      roles: new Set<string>(tokenDecoded.roles),
    };

    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    return user;
  }

  // Exponer getters como computed signals
  public readonly getCurrentUser = computed(() => this.currentUser());
  public readonly getIsLoggedIn = computed(() => this.isLoggedIn());

  private hasToken(): boolean {
    const hasToken = this.cookieService.check('accessToken');
    if (!hasToken) {
      // Evitar llamar a navigateToLogin aquí
      this.isLoggedIn.set(false);
    }
    return hasToken;
  }

  public navigateToLogin() {
    this.clearCookies();
    this.resetCurrentUser();

    // Evitar navegación circular si ya estamos en login
    if (!this.router.url.includes(URL_AUTH_LOGIN)) {
      this.router.navigate([URL_AUTH, URL_AUTH_LOGIN]).catch((error) => {
        console.error('Navigation error:', error);
      });
    }
  }

  public resetCurrentUser() {
    this.currentUser.set(this.getBlank());
    this.isLoggedIn.set(false);
  }

  // Método base para verificar roles
  private hasRole(allowedRoles: string[]): boolean {
    const user = this.currentUser();
    return (
      user.id > -1 &&
      allowedRoles.some((role) => user.roles?.has(role) ?? false)
    );
  }

  public isCommercialAllowed(): boolean {
    return this.hasRole(ROLES_COMMERCIAL);
  }

  public isProductionAllowed(): boolean {
    return this.hasRole(ROLES_PRODUCTION);
  }

  public isDispatchAllowed(): boolean {
    return this.hasRole(ROLES_DISPATCH);
  }

  public isBillingAllowed(): boolean {
    return this.hasRole(ROLES_BILLING);
  }

  public isAdminAllowed(): boolean {
    return this.hasRole(ROLES_ADMIN);
  }

  public isManagerAllowed(): boolean {
    return this.hasRole(ROLES_MANAGER);
  }

  public clearCookies() {
    // Clear tokens using delete method
    ['accessToken', 'refreshToken'].forEach((tokenName) => {
      try {
        this.cookieService.delete(tokenName, '/', undefined, false, 'Strict');
      } catch (error) {
        console.error(`Error clearing ${tokenName}:`, error);
      }
    });

    // Double-check and force remove if still present
    if (this.cookieService.check('accessToken')) {
      this.cookieService.delete('accessToken');
    }
    if (this.cookieService.check('refreshToken')) {
      this.cookieService.delete('refreshToken');
    }
  }
}
