import { NgIf, NgOptimizedImage } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { URL_HOME } from '@globals';
import { AuthenticationImplService } from '../../../../../shared/infrastructure/auth/authentication-impl.service';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    FontAwesomeModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
  ],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isSavingForm = signal(false);
  public isFormValid = signal(false);
  public passwordType = signal<'password' | 'text'>('password');
  public showPassword = signal(false);
  public formStatus = signal<'valid' | 'invalid' | 'pending'>('pending');

  @Input() title!: string;
  @Input() error!: string;
  @Input() welcome!: string;

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly authImplService = inject(AuthenticationImplService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;

  constructor() {
    this.loginForm = this.createLoginForm();

    // Detectar autocompletado del navegador
    setTimeout(() => {
      if (
        this.loginForm.get('username')?.value ||
        this.loginForm.get('password')?.value
      ) {
        this.loginForm.markAllAsTouched();
        this.validateForm();
      }
    });

    // Efecto para detectar cambios en el formulario
    effect(() => {
      if (
        this.loginForm.get('username')?.value ||
        this.loginForm.get('password')?.value
      ) {
        this.validateForm();
      }

      this.loginForm.valueChanges.subscribe(() => {
        this.validateForm();
      });
    });
  }

  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  private validateForm(): void {
    const usernameValid = this.loginForm.get('username')?.valid ?? false;
    const passwordValid = this.loginForm.get('password')?.valid ?? false;

    this.isFormValid.set(usernameValid && passwordValid);
    this.formStatus.set(this.isFormValid() ? 'valid' : 'invalid');

    // Actualizar mensaje de error
    if (this.formStatus() === 'invalid' && this.loginForm.touched) {
      this.error = 'Datos Inválidos';
    } else {
      this.error = '';
    }
  }

  ngOnInit() {
    this.formStatus.set('pending');
    this.isFormValid.set(false);
    this.passwordType.set('password');
    this.showPassword.set(false);
  }

  sanitizeUsername(username: string): string {
    return username.toLowerCase().replace(/[\u0300-\u036f]/g, '');
  }

  async onLogin() {
    this.passwordType.set('password');
    if (!this.isFormValid()) return;

    this.isSavingForm.set(true);

    // Updated password encoding with Unicode support
    const encodedPassword = btoa(
      encodeURIComponent(this.loginForm.value.password).replace(/%([0-9A-F]{2})/g, function(_, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      }),
    );

    const authenticationRequest = {
      username: this.sanitizeUsername(this.loginForm.value.username),
      password: encodedPassword,
    };

    try {
      const response = await this.authService.authenticate(
        authenticationRequest,
      );
      this.welcome = `Bienvenido ${this.loginForm.value.username}`;
      this.loginForm.clearValidators();
      this.loginForm.reset();
      this.authImplService.login(response);

      await this.router.navigate([URL_HOME], {
        relativeTo: this.route.root,
      });
    } catch (error) {
      console.error('Login error:', error);
      this.error = 'Hubo un error al intentar iniciar sesión';
    } finally {
      this.isSavingForm.set(false);
    }
  }

  onShowPassword() {
    this.showPassword.update((show) => !show);
    this.passwordType.set(this.showPassword() ? 'text' : 'password');
  }
}
