import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router, private tokenService: TokenService) { }

  canActivate(): boolean {
    const token = this.tokenService.getToken();
    
    if (token && token !== undefined) {
      // User is authenticated, allow access
      return true;
    } else {
      // User is not authenticated or token expired, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}