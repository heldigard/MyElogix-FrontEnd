import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, type OnInit } from '@angular/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  imports: [CommonModule, NgOptimizedImage],
})
export class LoaderComponent implements OnInit {
  public isLoading = false;
  public loaderService = inject(LoaderService);

  constructor() {
    // Move effect() into constructor
    effect(() => {
      this.isLoading = this.loaderService.isLoading();
    });
  }

  ngOnInit() {
    // Remove effect from ngOnInit
  }
}
