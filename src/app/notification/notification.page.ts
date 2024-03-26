import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  userId: any;
  constructor(private router: Router,private authService: AuthService,private tokenService: TokenService) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications(){
    this.userId = this.tokenService.getUser();
    console.log(this.userId[0].username);
    
    this.authService.getNotificationByUserId(this.userId[0].id).subscribe((res) => {
      console.log(res);
    })
  }
}
