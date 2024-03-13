import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-quiz',
  templateUrl: './start-quiz.page.html',
  styleUrls: ['./start-quiz.page.scss'],
})
export class StartQuizPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onStart(){
    this.router.navigate(['quiz-content'])
  }
  onClose(){
    this.router.navigate(['index-quiz'])
  }
}
