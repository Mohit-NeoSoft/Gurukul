import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { Browser } from '@capacitor/browser';
import { NavigationExtras, Router } from '@angular/router';
import { ZipService } from '../services/zip-service/zip.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  selectedDate: string = DateTime.now().toFormat('yyyy-MM-dd');
  cardDate: string = DateTime.now().toFormat('dd-MMM-yyyy');
  @ViewChild('popover') popover: any;
  isOpen: boolean = false;
  calendarData: any[] = [];
  month: any;
  year: any;
  dayOfMonth: any;
  data: any;
  userImg!: string;
  recentData: any[] = [];
  userId!: string;
  id!: string;
  userData: any[] = [];
  courseData: any[] = [];
  scormData: any;
  token: any;
  instanceId: any;
  eventDays: any[] = [];
  highlightedDates: any[] = [];

  constructor(private menuCtrl: MenuController, private authService: AuthService,
    private tokenService: TokenService, private router: Router, private zipService: ZipService) { }

  ngOnInit() {
    this.userImg = this.tokenService.getUser()[0]?.profileimageurl; // Safe navigation operator
    console.log(this.selectedDate);

    const parts = this.selectedDate.split('-');
    this.month = parts[1][1];
    this.year = parseInt(parts[0]);
    this.dayOfMonth = parts[2]
    this.getUser();
    this.fetchData();
  }

  onArrow() {
    this.menuCtrl.open('menu-calendar');
  }

  onChange(event: CustomEvent) {
    this.selectedDate = event.detail.value || this.selectedDate;
    const luxonDate = DateTime.fromISO(this.selectedDate);
    this.dayOfMonth = luxonDate.day;
    this.month = luxonDate.month;
    this.year = luxonDate.year;
    this.selectedDate = luxonDate.toFormat('dd-MMM-yyyy');
    this.cardDate = luxonDate.toFormat('dd-MMM-yyyy')
    this.fetchData();
  }

  fetchData() {
    this.calendarData = [];

    this.authService.getCalendarEvent(this.year, this.month).subscribe({
      next: (res) => {
        this.data = res;
        console.log(res);

        for (const week of this.data.weeks) {
          console.log(week);

          this.eventDays = week.days.filter((day: any) => {
            day.hasevents && day.mday === this.dayOfMonth
            if (day.hasevents) {
              console.log(day.timestamp);
              const date = new Date(day.neweventtimestamp * 1000);

              const formattedDate = date.toISOString().slice(0, 10);
              this.highlightedDates.push({
                date: formattedDate,
                textColor: 'rgb(68, 10, 184)',
                backgroundColor: 'rgb(211, 200, 229)',
              })
              // this.highlightedDates(day);
            }

          });
          const filteredDays = week.days.filter((day: any) => day.hasevents && day.mday === this.dayOfMonth);
          if (filteredDays.length > 0) {
            this.calendarData.push(filteredDays);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching calendar data:', error);
      },
    });
  }

  getUser() {
    this.userId = localStorage.getItem('username') || '';
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        this.userData = data;
        for (const userInfo of this.userData) {
          this.id = userInfo.id;
        }
        this.getRecentCourses();
        this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
      },
    });
  }

  getRecentCourses() {
    if (!this.id) {
      console.error('User ID not found.');
      return;
    }

    this.authService.getRecentCourses().subscribe({
      next: (data) => {
        this.recentData = data;
      },
      error: (error) => {
        console.error('Error fetching recent courses:', error);
      },
    });
  }

  onCardClick(value: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(value),
      },
    };
    this.router.navigate(['cyber-security'], navigationExtras);
  }

  onLink(value: any) {
    const parts = value.split('=');
    const id = parts[parts.length - 1];

    this.authService.getCoursesById(id).subscribe((res: any) => {
      this.courseData = res.courses[0]; // Assuming only one course is returned

      const navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(this.courseData),
        },
      };

      this.router.navigate(['cyber-security'], navigationExtras);
    }, (error) => {
      console.error('Error fetching course by ID:', error);
    });
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
