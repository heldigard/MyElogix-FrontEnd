import { Component } from '@angular/core';
import { FooterComponent } from './UI/core/footer/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { MenuPpalComponent } from './UI/core/header/menu-ppal/menu-ppal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MenuPpalComponent, RouterOutlet, FooterComponent],
})
export class AppComponent {
  title = 'elogix-frontend';
}
