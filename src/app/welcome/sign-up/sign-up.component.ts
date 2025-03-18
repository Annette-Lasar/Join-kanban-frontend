import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { RegistrationService } from '../../shared/services/registration.service';
import { ValidateInputFieldsService } from '../../shared/services/validateInputFields.service';
import { ButtonPropertyService } from '../../shared/services/button-propertys.service';
import { AuthService } from '../../shared/services/auth.service';
import { RouterModule } from '@angular/router';
import {
  RegistrationData,
  RegistrationResponse,
} from '../../shared/interfaces/registration.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit, OnDestroy {
  @Output() toggleLogIn = new EventEmitter<boolean>();
  @Output() registrationSuccess = new EventEmitter<void>();
  @Output() showSuccessMessage: boolean = false;
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  agreement: boolean = false;
  nameIsValid: boolean = true;
  emailIsValid: boolean = true;
  passwordIsValid: boolean = true;
  passwordMatch: boolean = true;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  passwordIcon: string = 'assets/icons/lock.svg';
  confirmPasswordIcon: string = 'assets/icons/lock.svg';
  backendError: any = {};
  subscriptions = new Subscription();

  constructor(
    private registrationService: RegistrationService,
    private validateInputFieldService: ValidateInputFieldsService,
    private buttonPropertyService: ButtonPropertyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscribeToNameValidation();
    this.subscribeToEmailValidation();
    this.subscribeToPasswordValidation();
    this.subscribeToPasswordMatch();
  }

  onSuccessfulSignUp(): void {
    this.registrationSuccess.emit();
  }

  togglePasswordVisibility(passwordType: string): void {
    if (passwordType === 'password') {
      this.passwordVisible = !this.passwordVisible;
      this.passwordIcon = this.passwordVisible
        ? 'assets/icons/visibility_on.svg'
        : 'assets/icons/visibility_off.svg';
    } else if (passwordType === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
      this.confirmPasswordIcon = this.confirmPasswordVisible
        ? 'assets/icons/visibility_on.svg'
        : 'assets/icons/visibility_off.svg';
    } else {
      console.warn('Unknown password type: ', passwordType);
    }
  }

  onPasswordFocus(passwordType: string): void {
    if (passwordType === 'password') {
      this.passwordIcon = 'assets/icons/visibility_off.svg';
    } else if (passwordType === 'confirmPassword') {
      this.confirmPasswordIcon = 'assets/icons/visibility_off.svg';
    } else {
      console.warn('Unknown password type: ', passwordType);
    }
  }

  onPasswordBlur(passwordType: string): void {
    if (passwordType === 'password') {
      this.passwordVisible = false;
      this.passwordIcon = 'assets/icons/lock.svg';
    } else if (passwordType === 'confirmPassword') {
      this.confirmPasswordVisible = false;
      this.confirmPasswordIcon = 'assets/icons/lock.svg';
    } else {
      console.warn('Unknown password tpye: ', passwordType);
    }
  }

  validateName(name: string) {
    this.validateInputFieldService.checkIfNameIsValid(name);
  }

  validateEmail(email: string) {
    this.validateInputFieldService.checkIfEmailIsValid(email);
  }

  validatePassword(password: string): void {
    this.validateInputFieldService.checkIfPasswordIsValid(password);
  }

  validatePasswordMatch(): void {
    this.validateInputFieldService.checkPasswordMatch(
      this.password,
      this.confirmPassword
    );
  }

  subscribeToNameValidation(): void {
    const subscription = this.validateInputFieldService.nameIsValid$.subscribe(
      (isValid) => {
        this.nameIsValid = isValid;
      }
    );
    this.subscriptions.add(subscription);
  }

  subscribeToEmailValidation(): void {
    const subscription = this.validateInputFieldService.emailIsValid$.subscribe(
      (isValid) => {
        this.emailIsValid = isValid;
      }
    );
    this.subscriptions.add(subscription);
  }

  subscribeToPasswordValidation(): void {
    const subscription =
      this.validateInputFieldService.passwordIsValid$.subscribe((isValid) => {
        this.passwordIsValid = isValid;
      });
    this.subscriptions.add(subscription);
  }

  subscribeToPasswordMatch(): void {
    const subscription =
      this.validateInputFieldService.passwordMatchSubject$.subscribe(
        (isValid) => {
          this.passwordMatch = isValid;
        }
      );
    this.subscriptions.add(subscription);
  }

  onSubmitSignUp(signUpForm: NgForm): void {
    if (!this.isFormValid()) {
      this.backendError = { error: 'Please fix the highlighted errors' };
      return;
    }

    const registrationData: RegistrationData = {
      name: this.name,
      email: this.email,
      username: this.email,
      password: this.password,
      repeated_password: this.confirmPassword,
    };

    this.sendRegistrationDataToServer(registrationData, signUpForm);
  }

  sendRegistrationDataToServer(
    registrationData: RegistrationData,
    signUpForm: NgForm
  ): void {
    this.registrationService.registerUser(registrationData).subscribe({
      next: (response: RegistrationResponse) => {
        console.log('Registration successful: ', response);
        this.authService.resetUserSubject();
        this.onSuccessfulSignUp();
        signUpForm.resetForm();
        this.returnToLoginPage();
      },
      error: (error) => {
        console.error('Registration error: ', error);
        this.backendError =
          error.error?.email ||
          error.error?.error ||
          'Registration failed. Please try again.';
      },
    });
  }

  isFormValid(): boolean {
    return (
      this.nameIsValid &&
      this.emailIsValid &&
      this.passwordIsValid &&
      this.agreement
    );
  }

  returnToLoginPage(): void {
    this.buttonPropertyService.toggleLoginStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
