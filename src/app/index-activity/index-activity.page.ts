import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-index-activity',
  templateUrl: './index-activity.page.html',
  styleUrls: ['./index-activity.page.scss'],
})
export class IndexActivityPage implements OnInit {
  @ViewChild('popover') popover: any;
  isOpen = false;
  showPrevious = true;
  showNext = false;

  constructor(private menuCtrl: MenuController) {}

  ngOnInit() {}

  onIndex() {
    this.menuCtrl.open('endMenu');
  }

  onClose(){
    this.menuCtrl.close('endMenu');
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  onPrevious(){
    this.showPrevious = true;
    this.showNext = false;
  }

  onNext(){
    this.showNext = true;
    this.showPrevious = false;
  }
}
