import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-start-quiz',
  templateUrl: './start-quiz.page.html',
  styleUrls: ['./start-quiz.page.scss'],
})
export class StartQuizPage implements OnInit {
  attemptId: any;
  
  constructor(private router: Router,private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);

      if (params && params.data) {
        this.attemptId = JSON.parse(params.data);
        
      }
    });
   }

  ngOnInit() {
  }

  onStart(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.attemptId),
      },
    };
    this.router.navigate(['quiz-content'],navigationExtras)
  }
  onClose(){
    this.router.navigate(['index-quiz'])
  }
}
