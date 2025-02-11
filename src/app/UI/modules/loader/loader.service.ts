import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = signal(false);
  public readonly isLoading = this.loading.asReadonly();

  show(): void {
    // console.log('Showing loader');
    this.loading.set(true);
  }

  hide(): void {
    // console.log('Hiding loader');
    this.loading.set(false);
  }

  toggle(): void {
    this.loading.update((current) => !current);
  }
}
