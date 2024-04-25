import { Component, Input, Optional } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Network } from '@capacitor/network';
import {
  AlertController,
  IonRouterOutlet,
  MenuController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { Utility } from '../utility/utility';
import { App } from '@capacitor/app';
import { ZipService } from '../services/zip-service/zip.service';

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
  courseData: any[] = [];
  userId: any;
  id: any;
  userData: any[] = [];
  userImg: any;
  recentData: any[] = [];
  // myCourses = [
  //   {
  //     id: 1,
  //     name: 'Cyber Security Awareness',
  //     type: 'Self Learning',
  //     src: 'assets/img/cyber.png',
  //     value: 0.5,
  //   },
  //   {
  //     id: 2,
  //     name: 'New Hire Training',
  //     type: 'Self Learning',
  //     src: 'assets/img/hire.png',
  //     value: 0.0,

  //   },
  //   {
  //     id: 3,
  //     name: 'Compliance Training',
  //     type: 'Self Learning',
  //     src: 'assets/img/compliance.png',
  //     value: 0.11,

  //   },
  // ];
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
  scormData: any;
  token: any;
  instanceId: any;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private tokenService: TokenService,
    public utility: Utility,
    private route: ActivatedRoute,
    private zipService: ZipService,
    private platform: Platform,
    @Optional() private routerOutlet: IonRouterOutlet
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
    this.initializeNetworkListener();
    // this.route.queryParams.subscribe((params: any) => {
    //   console.log(params);

    //   if (params && params.data) {
    //     this.userId = JSON.parse(params.data);
    //     console.log(this.userId);

    //   }
    // });
  }

  async ngOnInit() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // PushNotifications.register();
      } else {
      }
    });
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
    });
    this.getUser();

  }

  getUser() {
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

        this.tokenService.saveUser(this.userData);
        // this.getUserToken(this.id)
        this.getCourses(this.id);
        this.getRecentCourses(this.id);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  // getUserToken(id: any) {
  //   console.log(id);

  //   this.authService.getUserToken(id).subscribe({
  //     next: (data) => {
  //       console.log(data[0].token);
  //       // this.tokenService.saveToken(data[0].token)
  //      this.tokenService.saveToken(data[0].token)
  //       const isFirstTimeRefresh = localStorage.getItem('first_time_refresh');

  //       if (!isFirstTimeRefresh) {
  //         localStorage.setItem('first_time_refresh', 'true');
  //         window.location.reload();
  //       }

  //     },
  //     error: (error) => {
  //       console.error(error);
  //     },
  //   });
  // }

  getCourses(id: any) {
    console.log(id);

    this.authService.getCourses(id).subscribe({
      next: (data) => {
        console.log(data);
        this.courseData = data;
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  getRecentCourses(id: any) {
    console.log(id);

    this.authService.getRecentCourses().subscribe({
      next: (data) => {
        console.log(data);

        this.recentData = data;
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
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

  async onDownload(event: Event) {
    event.stopPropagation();
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

  onCardClick(value: any) {
    console.log(value);

    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(value),
      },
    };
    this.router.navigate(['cyber-security'], navigationExtras);
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

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      location.reload();
    }, 2000);
  }

  onRecentCardClick(value: any) {
    this.authService.getRecentCoursesByID(value.cmid).subscribe({
      next: (data) => {
        this.instanceId = data[0].instance;
        this.handleNavigation(value);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
    this.authService.getCourseContent(value.courseid).subscribe({
      next: (data) => {
        console.log(data);
        data.forEach((item: any) => {
          if (item.modules && item.modules.length > 0) {
            item.modules.forEach((module: any) => {

              if (module.modname === 'page' && value.modname === 'page') {
                if (module.id === value.cmid) {
                  this.handleNavigation(module);
                }
                console.log(module);
              }
              if (module.modname === 'scorm' && value.modname === 'scorm') {
                console.log(module.id === value.cmid);

                if (module.id === value.cmid) {
                  console.log(value);

                  this.authService.getScormsByCourseId(value.courseid).subscribe({
                    next: (data) => {
                      this.scormData = data.scorms;
                      if (this.scormData !== undefined) {
                        this.handleNavigation(module);
                      }
                    },
                    error: (error) => {
                      console.error('Login failed:', error);
                    },
                  });
                }
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  async handleNavigation(value: any) {
    if (this.instanceId) {
      if (value.modname === 'quiz') {
        localStorage.setItem('quizName', value.name);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            data: JSON.stringify(this.instanceId),
          },
        };
        await this.router.navigate(['index-quiz'], navigationExtras);
      }
      if (value.modname === 'page') {
        console.log(value);

        let navigationExtras: NavigationExtras = {
          queryParams: {
            data: JSON.stringify(value),
          },
        };
        await this.router.navigate(['index-activity'], navigationExtras);
      }
      if (value.modname === 'scorm') {
        if (this.scormData !== undefined) {
          console.log(this.scormData);

          this.scormData.forEach(async (scorm: any) => {

            if ((parseInt(this.instanceId) === parseInt(scorm.id)) === true) {
              console.log(scorm.packageurl);
              this.token = this.tokenService.getToken()
              // console.log(scorm.packageurl + `?token=${this.token}`);
              await this.zipService.downloadAndUnzip(scorm.packageurl + `?token=${this.token}`);
              // Browser.open({ url: `https://uat-gurukul.skfin.in/mod/scorm/player.php?a=${value.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
            }
          });
        }
      }
    }
  }
}
