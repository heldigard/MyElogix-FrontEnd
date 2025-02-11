import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-boolean-renderer',
  templateUrl: './boolean-renderer.component.html',
  styleUrls: ['./boolean-renderer.component.scss'],
  standalone: true,
})
export class BooleanRendererComponent implements ICellRendererAngularComp {
  // private params!: ICellRendererParams;
  value: boolean = false;
  public imgForValue!: string;

  constructor() {}

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    // this.params = params;
    this.value = params.value;
    // console.log('params', params);
    this.setIcon();
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    // set value into cell again
    // this.params = params;
    this.value = params.value;
    this.setIcon();
    return true;
  }

  private setIcon() {
    this.imgForValue =
      'assets/icons/' + (this.value ? 'yes-icon.png' : 'no-icon.png');
  }
}
