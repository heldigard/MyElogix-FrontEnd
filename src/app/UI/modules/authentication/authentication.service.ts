import { inject, Injectable } from '@angular/core';
import { AuthenticationImplService } from '../../../shared/infrastructure/auth/authentication-impl.service';
import { AuthenticationRequest } from '../../../shared/domain/models/auth/AuthenticationRequest';
import { AuthenticationResponse } from '../../../shared/domain/models/auth/AuthenticationResponse';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private gatewayAuthentication: AuthenticationImplService = inject(
    AuthenticationImplService,
  );
  constructor() {}

  public authenticate(
    authenticationRequest: AuthenticationRequest,
  ): Promise<AuthenticationResponse> {
    return lastValueFrom(
      this.gatewayAuthentication.authenticate(authenticationRequest),
    );
  }
}
