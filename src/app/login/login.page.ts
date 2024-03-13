import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { AuthService } from '../services/auth/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  otpLoginForm!: FormGroup;
  isLoggedIn: boolean = false;
  showPassword: boolean = false;
  passwordToggleIcon = 'eye';
  showOtpForm: boolean = false;
  showUserForm: boolean = true;
  toastMsg: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.createUserForm();
    this.createOtpForm();
  }

  createUserForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  createOtpForm() {
    this.otpLoginForm = this.fb.group({
      phone: ['', [Validators.required]],
      otp: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  get g() {
    return this.otpLoginForm.controls;
  }

  toggle() {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon === 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }

  changeForm(value: any) {
    if (value === 'otp') {
      this.showOtpForm = true;
      this.showUserForm = false;
    } else {
      this.showUserForm = true;
      this.showOtpForm = false;
    }
  }

  onSubmit() {
    this.isLoggedIn = true;
    if (this.loginForm.valid) {
      console.log(this.loginForm.get('username')?.value);
      try {
        this.authService
          .login(
            this.loginForm.get('username')?.value,
            this.loginForm.get('password')?.value
          )
          .subscribe({
            next: (res) => {
              console.log(res.error);
              this.tokenService.saveToken(res.token);
              if (res.error) {
                this.presentToast(res.error, 'danger');
              }
              if (res.token && res.token !== undefined) {
                this.router.navigate(['home']);
              }
            },
            error: (error) => {
              // this.toastMsg = error;
              this.presentToast(error, 'danger');
              console.error('Login failed:', error);
            },
          });
      } catch (error) {
        console.error('Error occurred during login:', error);
      }
    } else {
      return;
    }
  }

  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }
}
