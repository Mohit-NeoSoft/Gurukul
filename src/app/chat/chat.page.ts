import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { AuthService } from '../services/auth/auth.service';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  isExpanded1: boolean = false;
  isExpanded2: boolean = false;
  userImg: any;
  userId: any;
  userData: any[] = [];
  id: any;

  constructor(private router: Router, private tokenService: TokenService, private authService: AuthService,
    private menuCtrl: MenuController,private toastCtrl: ToastController,private loadingController: LoadingController) { }

  ngOnInit() {
    this.userId = localStorage.getItem('username')
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.userData = data

        for (let i = 0; i < data.length; i++) {
          this.id = this.userData[i].id
          this.userImg = this.userData[i].profileimageurl
        }
        console.log(this.id);

        // this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  toggleAccordion(value: any) {
    if (value === 1) {
      this.isExpanded1 = !this.isExpanded1;
    }
    if (value === 2) {
      this.isExpanded2 = !this.isExpanded2;
    }
  }

  onContact() {
    this.router.navigate(['chat-screen']);
  }

  onProfile() {
    this.menuCtrl.open('chatProfile');
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
    this.menuCtrl.close('chatProfile');
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
