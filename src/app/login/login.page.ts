import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { AuthService } from '../services/auth/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription, timer } from 'rxjs';

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
  passwordToggleIcon = 'eye-outline';
  toastMsg: any;
  isVisible: boolean = false;
  remainingTime = 30;
  timerColor: any = '#3553A1';
  segment: any = 'user';
  inputValue: any;

  private timerSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController
  ) { }

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

  // Getter methods for form controls
  get f() {
    return this.loginForm.controls;
  }

  get g() {
    return this.otpLoginForm.controls;
  }

  // Method to toggle password visibility
  toggle() {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.showPassword ? 'eye-off-outline' : 'eye-outline';
  }

  // Method to switch between user login and OTP login forms
  async changeForm(value: any) {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 2000
    });
    await loading.present();
    if (value === 'otp') {
      await loading.dismiss();
    } else {
      await loading.dismiss();
    }
  }

  // Method to handle submission of user login form
  onSubmit() {
    this.isLoggedIn = true;
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      this.authService.login(username, password).subscribe({
        next: (res) => {
          if (res.error) {
            this.presentToast(res.error, 'danger');
          }
          if (res.token && res.token !== undefined) {
            this.tokenService.saveToken(res.token);
            localStorage.setItem('username', username);
            this.router.navigate(['home']).then(() => {
              location.reload();
            });
          }
        },
        error: (error) => {
          this.presentToast(error, 'danger');
          console.error('Login failed:', error);
        },
        complete: () => {
          // Optionally handle completion if needed
        }
      });
    }
  }

  // Method to handle submission of OTP form
  onSubmitOtp() {
    this.isLoggedIn = true;
    if (this.otpLoginForm.valid) {
      const phone = this.otpLoginForm.get('phone')?.value;
      const otp = this.otpLoginForm.get('otp')?.value;
      this.authService.loginViaOtp(phone, otp).subscribe({
        next: (res) => {
          if (res.result === "error") {
            this.presentToast(res.result, 'danger');
          }
          if (res.result === "success") {
            this.tokenService.saveToken(res[0].token);
            localStorage.setItem('username', res[0].username);
            this.router.navigate(['home']).then(() => {
              location.reload();
            });
          }
        },
        error: (error) => {
          this.presentToast(error, 'danger');
          console.error('Login failed:', error);
        },
        complete: () => {
          // Optionally handle completion if needed
        }
      });
    }
  }

  // Method to handle max phone number length for OTP form
  onMaxPhone(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
    const maxLength = 10;
    if (this.inputValue.length > maxLength) {
      (event.target as HTMLInputElement).value = this.inputValue.slice(0, maxLength);
      this.otpLoginForm.patchValue({ phone: this.inputValue.slice(0, maxLength) });
    }
    console.log(this.inputValue.length);

    if (this.inputValue.length === 10) {
      this.authService.sendOtp(this.otpLoginForm.get('phone')?.value).subscribe(
        (data) => {
          if (data.result === "success") {
            this.presentToast("OTP Sent Successfully", 'success');
            const source = timer(0, 1000);
            this.timerSubscription = source.subscribe(() => {
              this.isVisible = true;
              if (this.remainingTime > 0) {
                this.remainingTime--;
                if (this.remainingTime <= 10) {
                  this.timerColor = '#B80000';
                }
                if (this.remainingTime <= 0) {
                  this.authService.expireOtp(this.otpLoginForm.get('phone')?.value).subscribe({
                    next: (res) => {
                      if (res.result === "error") {
                        this.presentToast(res.result, 'danger');
                      }
                      if (res.result === "success") {
                        this.presentToast("Otp Expired, Please Try Again", 'danger');
                      }
                    },
                    error: (error) => {
                      this.presentToast(error, 'danger');
                      console.error('Login failed:', error);
                    },
                  });
                }
              } else {
                this.isVisible = false;
                this.timerSubscription!.unsubscribe();
              }
            });
          } else {
            this.presentToast("OTP Sending Failed", 'danger');
          }
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );
    }
  }

  isPhoneValid() {
    return this.otpLoginForm.get('phone')?.value.toString().length === 10;
  }

  // Method to resend OTP
  resendOtp() {
    console.log(this.inputValue);
    
    if (this.inputValue.length === 10) {
      this.authService.sendOtp(this.otpLoginForm.get('phone')?.value).subscribe(
        (data) => {
          if (data.result === "success") {
            this.presentToast("OTP Sent Successfully", 'success');
            const source = timer(0, 1000);
            this.timerSubscription = source.subscribe(() => {
              this.isVisible = true;
              if (this.remainingTime > 0) {
                this.remainingTime--;
                if (this.remainingTime <= 10) {
                  this.timerColor = '#B80000';
                }
                if (this.remainingTime <= 0) {
                  this.authService.expireOtp(this.otpLoginForm.get('phone')?.value).subscribe({
                    next: (res) => {
                      if (res.result === "error") {
                        this.presentToast(res.result, 'danger');
                      }
                      if (res.result === "success") {
                        this.presentToast("Otp Expired, Please Try Again", 'danger');
                      }
                    },
                    error: (error) => {
                      this.presentToast(error, 'danger');
                      console.error('Login failed:', error);
                    },
                  });
                }
              } else {
                this.isVisible = false;
                this.timerSubscription!.unsubscribe();
              }
            });
          } else {
            this.presentToast("OTP Sending Failed", 'danger');
          }
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );
    }
  }

  // Method to present toast messages
  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }

  // Method to unsubscribe timer subscription on component destruction
  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // Method to handle segment change
  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }
}
