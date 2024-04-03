import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  selectedDate!: string;
  @ViewChild('popover') popover: any;
  isOpen = false;
  calendarData: any[]=[];
  month: any;
  year: any;
  data: any;
  constructor(private menuCtrl: MenuController, private authService: AuthService) {
    this.selectedDate = DateTime.now().toFormat('dd-MMM-yyyy');
  }

  ngOnInit() { }

  onArrow() {
    this.menuCtrl.open('menu-calendar');
  }

  onChange(event: CustomEvent) {
    this.selectedDate = event.detail.value;
    const luxonDate = DateTime.fromISO(this.selectedDate);
    const dayOfMonth = luxonDate.day;
    this.month = luxonDate.month;
    this.year = luxonDate.year;
    this.selectedDate = luxonDate.toFormat('dd-MMM-yyyy');
    console.log(this.month,this.year);

    this.fetchData();
  }

  fetchData() {
    this.authService.getCalendarEvent(this.year, this.month).subscribe({
      next: (res) => {
        console.log(res);
        this.data = res;
        this.calendarData = [];
        for (let i = 0; i < this.data.weeks.length; i++) {
          this.calendarData.push(this.data.weeks[i].days);
        }
        console.log(this.calendarData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
}
