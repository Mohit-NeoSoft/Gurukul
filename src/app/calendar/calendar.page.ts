import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  selectedDate!: string;
  @ViewChild('popover') popover: any;
  isOpen = false;

  constructor(private menuCtrl: MenuController) { 
    this.selectedDate = DateTime.now().toFormat('dd-MMM-yyyy');
  }

  ngOnInit() {
  }

  onArrow() {
    this.menuCtrl.open('menu-calendar');
  }

  onChange(event: CustomEvent) {
    this.selectedDate = event.detail.value;
    const luxonDate = DateTime.fromISO(this.selectedDate);    
    this.selectedDate = luxonDate.toFormat('dd-MMM-yyyy');
  }
  
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
}
