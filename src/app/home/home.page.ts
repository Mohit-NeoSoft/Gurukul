import { Component, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Network } from '@capacitor/network';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  showAlert: boolean = false;
  showFirst: boolean = true;
  showSecond: boolean = false;
  showThird: boolean = false;
  showFourth: boolean = false;
  selectedDate!: string;
  status: any;
  courseData: any;
  myCourses = [
    {
      id: 1,
      name: 'Cyber Security Awareness',
      type: 'Self Learning',
      src: 'assets/img/cyber.png',
      value: 0.5,
    },
    {
      id: 2,
      name: 'New Hire Training',
      type: 'Self Learning',
      src: 'assets/img/hire.png',
      value: 0.0,
      
    },
    {
      id: 3,
      name: 'Compliance Training',
      type: 'Self Learning',
      src: 'assets/img/compliance.png',
      value: 0.11,
      
    },
  ];
  recCourses = [
    {
      id: 1,
      name: 'New Hire Training Collection',
      type: 'Self Learning',
      src: 'assets/img/newHire.png',
      value: 0,
    },
    {
      id: 2,
      name: '2W & SME',
      type: '2W & SME',
      src: 'assets/img/2w.png',
      value: 0,
    },
  ];

  constructor(
    private alertController: AlertController,
    private router: Router,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private toastCtrl:ToastController,
    private tokenService: TokenService,
  ) {
    this.initializeNetworkListener();
  }

  async ngOnInit() {
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
    });
    this.authService.getCourses().subscribe({
      next: data => {
        console.log(data);
        this.courseData = data;
      },error: error => {
        console.error('Login failed:', error);
      }
    })
  }

  async initializeNetworkListener() {
    // Add a listener for network status changes
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message:
        'You are not currently connected to WI-FI. It was not Possible to calculate the size of the download. Are you sure you want to continue',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'btn_cancel',
          handler: () => {
            console.log('Cancelled');
          },
        },
        {
          text: 'Ok',
          cssClass: 'btn_ok',
          handler: () => {
            this.router.navigate(['course-downloads']);
            console.log('Ok');
          },
        },
      ],
    });

    await alert.present();
  }

  onArrow() {
    this.menuCtrl.open('menu');
  }

  async onDownload() {
    this.status = await Network.getStatus();
    console.log('Network status:', this.status);
    if (this.status.connectionType !== 'wifi') {
      this.presentAlert();
    }
    if (this.status.connectionType === 'wifi') {
      this.router.navigate(['course-downloads']);
    }
  }

  onCancel() {
    this.showAlert = false;
  }

  onOk() {
    this.showAlert = false;
  }

  onClose() {
    this.menuCtrl.close('menuProfile');
  }

  onCardClick(value: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(value)
      }
    };
    console.log(value);
    // if (value.id === 1) {
      this.router.navigate(['cyber-security'], navigationExtras);
    // }
  }

  onProfile() {
    this.menuCtrl.open('menuProfile');
  }

  async openCapacitorSite() {
    await Browser.open({ url: 'https://uat-gurukul.skfin.in' });
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

  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }
  onLogout(){
    this.tokenService.logOut();
    this.router.navigate(['login']).then(() => {
      location.reload();
    });
    this.presentToast('Logged Out successfully', 'success');
  }
}
