import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interceptorProviders } from './interceptors/interceptors';
import { ToastrModule } from 'ngx-toastr';
import { FooterComponent } from './footer/footer/footer.component';
import { AvatarModule } from 'ngx-avatars';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuPpalComponent } from './header/menu-ppal/menu-ppal.component';
import { LoaderModule } from '../modules/loader/loader.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    AvatarModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    LoaderModule,
    FontAwesomeModule,
    FooterComponent,
    MenuPpalComponent,
  ],
  providers: [interceptorProviders],
  exports: [FooterComponent, AvatarModule, MenuPpalComponent],
})
export class CoreModule {}
