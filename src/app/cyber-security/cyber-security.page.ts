import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-cyber-security',
  templateUrl: './cyber-security.page.html',
  styleUrls: ['./cyber-security.page.scss'],
})
export class CyberSecurityPage implements OnInit {
  value = 0.5;
  segment: any = 'course';
  showMain: boolean = true;
  showPwdSec: boolean = false;
  showDesktop: boolean = false;
  showLite: boolean = false;
  showInfo: boolean = false;
  courseName: any;
  data: any;
  courseData: any;
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
  isExpanded1: boolean = false;
  isExpanded2: boolean = false;
  isExpanded3: boolean = false;
  isExpanded4: boolean = false;
  isExpanded5: boolean = false;

  constructor(private router: Router,private route: ActivatedRoute,private authService: AuthService) {
    this.route.queryParams.subscribe((params: any) => {
      if (params && params.data) {
        this.data = JSON.parse(params.data);
        // this.courseName = params.data.displayname;
        this.authService.getCourseContent(this.data.id).subscribe({
          next: (data) => {
            console.log(data[0]);
            this.courseData = data;
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
        });
      }
    });
  }

  ngOnInit() {}

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
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
    this.router.navigate(['course-index']);
  }

  onClick() {
    this.router.navigate(['communication']);
  }
  toggleAccordion(value: any) {
    if (value === 1) {
      this.isExpanded1 = !this.isExpanded1;
    }
    if (value === 2) {
      this.isExpanded2 = !this.isExpanded2;
    }
    if (value === 3) {
      this.isExpanded3 = !this.isExpanded3;
    }
    if (value === 4) {
      this.isExpanded4 = !this.isExpanded4;
    }
    if (value === 5) {
      this.isExpanded5 = !this.isExpanded5;
    }
  }

  extractImageUrl(summary: string): string {
    const startIndex = summary.indexOf('src="') + 5;
    const endIndex = summary.indexOf('"', startIndex);
    const imageUrl = summary.substring(startIndex, endIndex);
    return imageUrl.replace('/webservice', '');
  }
}
