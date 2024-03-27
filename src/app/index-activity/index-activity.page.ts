import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';

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
  data: any;
  token: any;

  constructor(private menuCtrl: MenuController,private route: ActivatedRoute,private tokenService: TokenService) {
    this.route.queryParams.subscribe((params: any) => {
      if (params && params.data) {
        this.data = JSON.parse(params.data);
        console.log(this.data); 
      }
    });
  }

  ngOnInit() {
    this.token = this.tokenService.getToken();
  }

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

  extractImageUrl(url: string): string {
    const fileExtensions = ['.PNG', '.png', '.jpeg', '.jpg', '.jfif'];

    let lastDotIndex = -1;
    for (const extension of fileExtensions) {
      const extensionIndex = url.lastIndexOf(extension);
      if (extensionIndex > lastDotIndex) {
        lastDotIndex = extensionIndex;
      }
    }

    const extractedUrl = url.substring(0, lastDotIndex + 4);

    return extractedUrl;
  }
}
