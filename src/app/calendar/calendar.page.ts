import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { Browser } from '@capacitor/browser';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  selectedDate: string = DateTime.now().toFormat('dd-MMM-yyyy');
  @ViewChild('popover') popover: any;
  isOpen: boolean = false;
  calendarData: any[] = [];
  month!: number;
  year!: number;
  dayOfMonth!: number;
  data: any = [];
  userImg!: string;
  recentData: any[] = [];
  userId!: string;
  id!: string;
  userData: any[] = [];
  courseData: any[] = [];

  constructor(private menuCtrl: MenuController, private authService: AuthService,
    private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
    this.userImg = this.tokenService.getUser()[0]?.profileimageurl; // Safe navigation operator
    this.fetchData();
    this.getUser();
  }

  onArrow() {
    this.menuCtrl.open('menu-calendar');
  }

  onChange(event: CustomEvent) {
    this.selectedDate = event.detail.value || this.selectedDate; // Handle undefined event value
    const luxonDate = DateTime.fromISO(this.selectedDate);
    this.dayOfMonth = luxonDate.day;
    this.month = luxonDate.month;
    this.year = luxonDate.year;
    this.selectedDate = luxonDate.toFormat('dd-MMM-yyyy');
    this.fetchData();
  }

  fetchData() {
    this.calendarData = [];

    this.authService.getCalendarEvent(this.year, this.month).subscribe({
      next: (res) => {
        this.data = res;

        for (const week of this.data.weeks) {
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

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  async openCapacitorSite(value: any) {
    try {
      await Browser.open({ url: value });
    } catch (error) {
      console.error('Error opening browser:', error);
    }
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

    this.authService.getRecentCourses(this.id).subscribe({
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
}
