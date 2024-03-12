import { Injectable, Injector } from '@angular/core';
import { TokenService } from '../token/token.service';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }


  intercept(req:any, next:any) {
    let tokenStorage=this.injector.get(TokenService)
    
    let tokenizedReq = req.clone({
     setHeaders:{
      "x-access-token":`${tokenStorage.getToken()}`
     }
    })
    return next.handle(tokenizedReq)
  }
}