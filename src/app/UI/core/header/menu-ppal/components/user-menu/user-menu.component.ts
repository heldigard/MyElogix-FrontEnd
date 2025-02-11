import { Component, inject, Input, ViewChild } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatars';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationImplService } from '../../../../../../shared/infrastructure/auth/authentication-impl.service';
import { UserDTO } from '../../../../../../shared/domain/models/auth/UserDTO';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-user-menu',
  imports: [
    MatMenu,
    MatMenuTrigger,
    AvatarModule,
    FaIconComponent,
    NgIf,
    MatMenuItem,
    MatButton,
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  @Input() user!: UserDTO;
  @ViewChild('userMenuTrigger') userMenuTrigger!: MatMenuTrigger;
  protected readonly faDoorOpen = faDoorOpen;
  private readonly authService: AuthenticationImplService = inject(
    AuthenticationImplService,
  );

  constructor() {}

  onLogout() {
    this.authService.logout();
  }

  getCurrentUseName() {
    if (this.user) {
      return this.user.firstName + ' ' + this.user.lastName;
    }
    return '';
  }

  closeMenu() {
    this.userMenuTrigger.closeMenu();
  }
}
