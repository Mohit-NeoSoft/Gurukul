import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-quiz',
  templateUrl: './index-quiz.page.html',
  styleUrls: ['./index-quiz.page.scss'],
})
export class IndexQuizPage implements OnInit {
  @ViewChild('popover') popover: any;
  isOpen = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  onStart(){
    this.router.navigate(['start-quiz']);
  }

}
