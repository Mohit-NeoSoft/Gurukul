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
  showOtpForm: boolean = false;
  showUserForm: boolean = true;
  toastMsg: any;
  isVisible: boolean = false;
  remainingTime = 30;
  timerColor: any = '#3553A1';
  userId: any;
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

  get f() {
    return this.loginForm.controls;
  }

  get g() {
    return this.otpLoginForm.controls;
  }

  toggle() {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon === 'eye-outline') {
      this.passwordToggleIcon = 'eye-off-outline';
    } else {
      this.passwordToggleIcon = 'eye-outline';
    }
  }

  async changeForm(value: any) {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 2000
    });
    await loading.present();
    if (value === 'otp') {
      await loading.dismiss();
      this.showOtpForm = true;
      this.showUserForm = false;
    } else {
      await loading.dismiss();
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
              localStorage.setItem('username',this.loginForm.get('username')?.value)
              console.log(res);

              if (res.error) {
                this.presentToast(res.error, 'danger');
              }
              if (res.token && res.token !== undefined) {
                // let navigationExtras: NavigationExtras = {
                //   queryParams: {
                //     data: this.loginForm.get('username')?.value,
                //   },
                // };
                // this.router.navigate(['home'], navigationExtras);
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

  onMaxPhone() {
    if (this.otpLoginForm.get('phone')?.value.length === 10) {
      console.log(this.otpLoginForm.get('phone')?.value);
      this.authService.sendOtp(this.otpLoginForm.get('phone')?.value).subscribe(
        (data) => {
          console.log('logindata:', JSON.stringify(data));
          if (data.result === "success") {
            this.presentToast("OTP Sent Successfully", 'success');
            const source = timer(0, 1000);
            this.timerSubscription = source.subscribe(() => {
              this.isVisible = true;
              if (this.remainingTime > 0) {
                this.remainingTime--;
                if (this.remainingTime <= 10) {
                  this.timerColor = '#B80000'
                }
                if (this.remainingTime <= 0) {
                  this.authService
                    .expireOtp(
                      this.otpLoginForm.get('phone')?.value
                    )
                    .subscribe({
                      next: (res) => {
                        console.log(res.error);
                        if (res.result === "error") {
                          this.presentToast(res.result, 'danger');
                        }
                        if (res.result === "success") {
                          this.presentToast("Otp Expired, Please Try Again", 'Danger');
                        }
                      },
                      error: (error) => {
                        // this.toastMsg = error;
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
  onSubmitOtp() {
    this.isLoggedIn = true;
    if (this.otpLoginForm.valid) {
      console.log(this.otpLoginForm.get('phone')?.value);
      try {
        this.authService
          .loginViaOtp(
            this.otpLoginForm.get('phone')?.value, this.otpLoginForm.get('otp')?.value
          )
          .subscribe({
            next: (res) => {
              console.log(res.error);
              this.tokenService.saveToken(res.token);
              console.log(res[0].username);
              if (res.result === "error") {
                this.presentToast(res.result, 'danger');
              }
              if (res.result === "success") {
                console.log(this.userId);
                this.tokenService.saveToken(res[0].token);
                let navigationExtras: NavigationExtras = {
                  queryParams: {
                    data: res[0].username,
                  },
                };
                this.router.navigate(['home'], navigationExtras);
                
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

  resendOtp() {
    if (this.otpLoginForm.get('phone')?.value.length === 10) {
      this.onMaxPhone();
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

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
