import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { ToastController } from '@ionic/angular';

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
  quizResult: any;
  quizGrade: any;
  quizName: any;
  showGrade: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute,
    private authService: AuthService, private toastCtrl: ToastController) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);

      if (params && params.data) {
        this.data = JSON.parse(params.data);
        this.quizName = JSON.parse(params.name);
        this.authService.startQuizById(this.data).subscribe({
          next: (data) => {
            console.log(data);
            this.data = data
            if (data.attempt) {
              this.attemptId = data.attempt.id
              // this.getAttemptSummary();
              console.log(this.attemptId);
            } else {
              this.errorMsg = this.data.message
              console.log(this.errorMsg);

            }
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
        });
      }

      if (params.quizResult) {
        this.quizResult = JSON.parse(params.quizResult);
        console.log(this.quizResult.attempt);
        this.showGrade = true
        this.quizGrade = this.quizResult.grade

        console.log(this.quizGrade);

        this.authService.startQuizById(this.quizResult.attempt.quiz).subscribe({
          next: (data) => {
            console.log(data);
            this.data = data
            if (data.attempt) {
              this.attemptId = data.attempt.id
              // this.getAttemptSummary();
              console.log(this.attemptId);
            } else {
              this.errorMsg = this.data.message
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

  getAttemptSummary() {
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
    console.log(this.errorMsg);

    if (this.errorMsg) {
      this.presentToast(this.errorMsg, 'danger');
    }
    if (this.attemptId !== '' && this.attemptId !== undefined) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(this.attemptId),
        },
      };
      this.router.navigate(['start-quiz'], navigationExtras);
    }
  }

  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }

}
