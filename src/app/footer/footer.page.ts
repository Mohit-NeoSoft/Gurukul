import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {
  URL: any;

  constructor(private router: Router) { 
    this.URL = this.router.url;
  }

  ngOnInit() {}

  onHome(){
    this.router.navigate(['home'])
  }

  onCalendar(){
    this.router.navigate(['calendar'])
  }

  onBell(){
    this.router.navigate(['notification'])
  }

  onChat(){
    this.router.navigate(['chat'])
  }

  onMore(){
    this.router.navigate(['more'])
  }
}
