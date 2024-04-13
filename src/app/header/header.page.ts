import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {
  @Input() profileImg: any;
  userId: any;
  userImg: any;
  userData: any[] = [];
  id: any;
  constructor(private authService: AuthService, private tokenService: TokenService,private menuCtrl: MenuController,
    private router: Router, private toastCtrl: ToastController,private loadingController: LoadingController) { }

  ngOnInit() {
    this.userId = localStorage.getItem('username')
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.userData = data

        for (let i = 0; i < data.length; i++) {
          this.id = this.userData[i].id
          this.userImg = this.userData[i].profileimageurlsmall
        }
        console.log(this.id);
        
        // this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  async loadUserData() {
    try {
      this.userData = await this.tokenService.getUser();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  onProfile() {
    this.menuCtrl.open('menuProfile');
  }

  onGrades() {
    this.router.navigate(['grades']);
  }
  onBadges() {
    this.router.navigate(['badges']);
  }
  onPreferences() {
    this.router.navigate(['preferences']);
  }

  async openCapacitorSite() {
    await Browser.open({ url: 'https://uat-gurukul.skfin.in' });
  }

  onClose() {
    this.menuCtrl.close('menuProfile');
  }

  async onLogout() {
    const loading = await this.loadingController.create({
      // message: 'Loading...',
      duration: 2000
    });
    await loading.present();
    this.tokenService.logOut();
    this.presentToast('Logged Out successfully', 'success');
    this.router.navigate(['login']).then(() => {
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
    await loading.dismiss();
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
