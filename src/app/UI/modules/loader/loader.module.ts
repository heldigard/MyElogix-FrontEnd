import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoaderComponent } from './pages/loader.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoaderService } from './loader.service';
@NgModule({ exports: [LoaderComponent], imports: [CommonModule, NgOptimizedImage, LoaderComponent], providers: [LoaderService, provideHttpClient(withInterceptorsFromDi())] })
export class LoaderModule {}
