import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  otpLoginForm!: FormGroup;
  isLoggedIn: boolean = false;
  showPassword: boolean=false;
  passwordToggleIcon='eye'
  showOtpForm: boolean = false;
  showUserForm: boolean = true;

  constructor(private router: Router, private fb: FormBuilder,private http: HttpClient) { }

  ngOnInit() {
    this.createUserForm();
    this.createOtpForm();
  }

  createUserForm(){
    this.loginForm = this.fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]]
    })
  }

  createOtpForm(){
    this.otpLoginForm = this.fb.group({
      phone: ['',[Validators.required]],
      otp: ['',[Validators.required]]
    })
  }

  get f() {
    return this.loginForm.controls;
  }

  get g(){
    return this.otpLoginForm.controls;
  }

  toggle(){
    this.showPassword=!this.showPassword
    if(this.passwordToggleIcon==='eye'){
      this.passwordToggleIcon='eye-off'
    }else{
      this.passwordToggleIcon='eye'

    }
  }

  changeForm(value: any){    
    if(value === 'otp'){
      this.showOtpForm = true;
      this.showUserForm = false;
    }else{
      this.showUserForm = true;   
      this.showOtpForm = false; 
    }
    
  }


  onSubmit(){
    this.isLoggedIn = true;
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      
      this.router.navigate(['home'])
      return false;
    } else {
      return 
    }
  };
}
