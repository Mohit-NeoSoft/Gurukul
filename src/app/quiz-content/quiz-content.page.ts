import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-quiz-content',
  templateUrl: './quiz-content.page.html',
  styleUrls: ['./quiz-content.page.scss'],
})
export class QuizContentPage implements OnInit {
  @Input() durationInSeconds: number = 600;
  timer: number = this.durationInSeconds;
  timerSubscription!: Subscription;
  selectedValues: any = {};
  showNext: boolean = true;
  quizContent = [
    {
      id: 1,
      heading: 'Question 1',
      en: 'If you know the sender you, you can click the email link',
      hn: '( यदि आप ईमेल भेजने वाले को जानते है तो आप ईमेल भेजने वाले के लिंक पर क्लिक कर सकते है ? )',
      a: 'True',
      b: 'False',
      selecetdValue: null,
    },
    {
      id: 2,
      heading: 'Question 2',
      en: 'If you know the sender you, you can click the email link',
      hn: '( यदि आप ईमेल भेजने वाले को जानते है तो आप ईमेल भेजने वाले के लिंक पर क्लिक कर सकते है ? )',
      a: 'True',
      b: 'False',
      selecetdValue: null,
    },
  ];

  constructor(private menuCtrl: MenuController,private router: Router) {}

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    const timer$ = interval(1000);
    this.timerSubscription = timer$.subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      }
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  handleChange(event: any, item: any) {
    console.log('Current value:', event.target.value, item);
    this.selectedValues[item.heading] = event.target.value;
    console.log(this.selectedValues);
  }

  clearSelection(item: any) {
    item.selecetdValue = null;
    delete this.selectedValues[item.heading];
    console.log(this.selectedValues);
  }

  onBookmark() {
    this.menuCtrl.open('quizMenu');
  }

  onNext(){
    this.showNext = true;
  }

  onClose() {
    this.menuCtrl.close('quizMenu');
  }

  onSubmit(){
    this.router.navigate(['index-quiz'])
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
