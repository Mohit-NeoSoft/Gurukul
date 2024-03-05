import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  isExpanded1: boolean = false;
  isExpanded2: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleAccordion(value: any) {
    if (value === 1) {
      this.isExpanded1 = !this.isExpanded1;
    }
    if (value === 2) {
      this.isExpanded2 = !this.isExpanded2;
    }
  }

  onContact(){
    this.router.navigate(['chat-screen']);
  }
}
