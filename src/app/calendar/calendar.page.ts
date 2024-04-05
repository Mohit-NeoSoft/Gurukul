import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  selectedDate!: string;
  @ViewChild('popover') popover: any;
  isOpen = false;
  calendarData: any[] = [];
  month: any;
  year: any;
  dayOfMonth: any;
  data: any;
  userImg: any;

  constructor(private menuCtrl: MenuController, private authService: AuthService, private tokenService: TokenService) {
    this.selectedDate = DateTime.now().toFormat('dd-MMM-yyyy');
  }

  ngOnInit() {
    this.userImg = this.tokenService.getUser()[0].profileimageurlsmall;
    this.fetchData(); // Fetch initial data on component initialization
  }

  onArrow() {
    this.menuCtrl.open('menu-calendar');
  }

  onChange(event: CustomEvent) {
    this.selectedDate = event.detail.value;
    const luxonDate = DateTime.fromISO(this.selectedDate);
    this.dayOfMonth = luxonDate.day;
    this.month = luxonDate.month;
    this.year = luxonDate.year;
    this.selectedDate = luxonDate.toFormat('dd-MMM-yyyy');
    this.fetchData(); // Fetch data based on selected date
  }

  fetchData() {
    this.calendarData = [];

    this.authService.getCalendarEvent(this.year, this.month).subscribe({
      next: (res) => {
        console.log(res);
        this.data = res;
        
        for (let i = 0; i < this.data.weeks.length; i++) {
          const week = this.data.weeks[i].days.filter((day: any) => day.hasevents && day.mday === this.dayOfMonth);
          if (week.length > 0) {
            this.calendarData.push(week);
          }
        }
        console.log(this.calendarData);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  async openCapacitorSite(value: any) {
    await Browser.open({ url: value });
  }
}
