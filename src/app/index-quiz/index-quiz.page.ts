import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-index-quiz',
  templateUrl: './index-quiz.page.html',
  styleUrls: ['./index-quiz.page.scss'],
})
export class IndexQuizPage implements OnInit {
  @ViewChild('popover') popover: any;
  isOpen = false;
  data: any;
  attemptId: any;
  quizData: any;
  errorMsg: any;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);

      if (params && params.data) {
        // this.data = JSON.parse(params.data);
        this.authService.startQuizById(params.data).subscribe({
          next: (data) => {
            console.log(data);
            this.data = data
            if (data.attempt) {
              this.attemptId = data.attempt.id
              // this.getAttemptSummary();
              console.log(this.attemptId);
            } else {
              this.errorMsg = this.data.errorcode
              console.log(this.errorMsg);

            }
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
        });
      }
    });
  }

  ngOnInit() {
    
  }

  getAttemptSummary(){
    this.authService.getAttemptSummary(this.attemptId).subscribe({
      next: (res) => {
        this.quizData = res
        console.log(res);

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

  onStart() {
    if(this.attemptId !== '' && this.attemptId !== undefined){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.attemptId),
      },
    };
    this.router.navigate(['start-quiz'], navigationExtras);
  }
  }

}
