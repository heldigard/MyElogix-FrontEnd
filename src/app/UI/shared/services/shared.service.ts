import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private apiURL = environment.apiURL + environment.apiVersion;
  private localEndpoint = '/live';

  private httpClient: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {}

  private isServerReady(): Promise<Boolean> {
    return lastValueFrom(this.serverReady());
  }

  private serverReady(): Observable<Boolean> {
    const endpoint = this.localEndpoint + '/ready';
    return this.httpClient.get<Boolean>(this.apiURL + endpoint);
  }

  checkReady(): void {
    this.isServerReady()
      .then((r) => {})
      .catch((err) => {
        console.error(err);
      });
  }
}
