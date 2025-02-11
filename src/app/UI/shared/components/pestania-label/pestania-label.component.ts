import { Component, Input, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-pestania-label',
    templateUrl: './pestania-label.component.html',
    styleUrls: ['./pestania-label.component.scss'],
    imports: [NgOptimizedImage]
})
export class PestaniaLabelComponent implements OnInit {
  @Input() icon!: string;
  @Input() title!: string;
  public icon_path!: string;

  constructor() {}

  ngOnInit(): void {
    let parentPath = 'assets/icons/';
    this.icon_path = `${parentPath}${this.icon}`;
  }
}
