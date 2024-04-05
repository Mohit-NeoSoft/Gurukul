import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Utility } from '../utility/utility';
import { TokenService } from '../services/token/token.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-cyber-security',
  templateUrl: './cyber-security.page.html',
  styleUrls: ['./cyber-security.page.scss'],
})
export class CyberSecurityPage implements OnInit {
  @ViewChild('popover') popover: any;
  isOpen = false;
  value = 0.5;
  segment: any = 'course';
  showMain: boolean = true;
  showPwdSec: boolean = false;
  showDesktop: boolean = false;
  showLite: boolean = false;
  showInfo: boolean = false;
  courseName: any;
  data: any;
  token: any
  courseData: any;
  scormData: any;
  gradesData: any;
  scormId: any;
  selectedModuleIndices: { [key: number]: number } = {};
  myCourses = [
    {
      id: 1,
      name: 'Cyber Security Awareness',
      type: 'Self Learning',
      src: 'assets/img/cyber.png',
      value: 0,
      download: true,
      myCourse: true,
    },
  ];
  isExpanded: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService,
    public utility: Utility, private tokenService: TokenService) {
    this.route.queryParams.subscribe((params: any) => {

      if (params && params.data) {
        this.data = JSON.parse(params.data);
        console.log(this.data);

        // this.courseName = params.data.displayname;
        this.authService.getCourseContent(this.data.id).subscribe({
          next: (data) => {
            this.courseData = data;
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
        });
      }
    });
  }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.getScorms();
  }

  getScorms() {
    this.authService.getScormsByCourseId(this.data.id).subscribe({
      next: (data) => {
        console.log(data);
        this.scormData = data.scorms;

      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    const user = this.tokenService.getUser();
    console.log(user[0].id);

    console.log(this.segment);
    if (this.segment === 'grades') {
      console.log(this.data.id);

      this.authService.getUserGrades(user[0].id, this.data.id).subscribe({
        next: (res) => {
          console.log(res);
          this.gradesData = res.usergrades
          console.log(this.gradesData);

        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
    }

  }

  onPwdSec() {
    this.showMain = false;
    this.showPwdSec = true;
    this.showDesktop = false;
    this.showLite = false;
    this.showInfo = false;
  }

  onCybSec() {
    this.showMain = true;
    this.showPwdSec = false;
    this.showDesktop = false;
    this.showLite = false;
    this.showInfo = false;
  }
  onDesktop() {
    this.showPwdSec = false;
    this.showMain = false;
    this.showDesktop = true;
    this.showLite = false;
    this.showInfo = false;
  }
  onDesktopLite() {
    this.showPwdSec = false;
    this.showMain = false;
    this.showDesktop = false;
    this.showLite = true;
    this.showInfo = false;
  }
  onInfo() {
    this.showPwdSec = false;
    this.showMain = false;
    this.showDesktop = false;
    this.showLite = false;
    this.showInfo = true;
  }

  onIndex() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.data),
      },
    };
    this.router.navigate(['course-index'], navigationExtras);
  }

  onComm() {
    this.router.navigate(['communication']);
  }

  onClick(value: any) {
    console.log(value);
    if (value.modname === 'quiz') {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          name: JSON.stringify(value.name),
          data: JSON.stringify(value.instance),
        },
      };
      this.router.navigate(['index-quiz'], navigationExtras)
    }
    if (value.modname === 'page') {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(value),
        },
      };
      this.router.navigate(['index-activity'], navigationExtras)
    }
    if (value.modname === 'scorm') {
      console.log(this.scormData);
      this.scormData.forEach((scorm: any) => {
        this.courseData.find((module: any) => module.modules.some((item: any) => {
          console.log((item.instance === scorm.id) === true);
          
          if((item.instance === scorm.id) === true){
            Browser.open({ url: `https://uat-gurukul.skfin.in/mod/scorm/player.php?a=${item.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
          }
        }
        ));
      });
    }
  }

  toggleAccordion(i: number, j: number) {
    const accordionIndex = 'cyber_' + i + '_' + j;
    // If the clicked accordion is already expanded, collapse it
    this.isExpanded = this.isExpanded === accordionIndex ? '' : accordionIndex;
  }

  extractImageUrl(summary: string): string {
    const regex = /<img[^>]+src="([^">]+?\.(?:png|jpg|jpeg|gif|jfif))[^">]*"/;
    const matches = summary.match(regex);
    const imageUrl = matches ? matches[1] : '';
    return imageUrl;
  }

  // presentPopover(e: Event) {
  //   e.stopPropagation();
  //   this.popover.event = e;
  //   this.isOpen = true;
  // }

  presentPopover(event: MouseEvent, courseIndex: number, moduleIndex: number) {
    event.stopPropagation();
    this.selectedModuleIndices[courseIndex] = moduleIndex; // Store the selected module index for the corresponding course
    this.isOpen = true;
  }

  isPopoverOpen(courseIndex: number, moduleIndex: number) {
    return this.isOpen && this.selectedModuleIndices[courseIndex] === moduleIndex;
  }
}
