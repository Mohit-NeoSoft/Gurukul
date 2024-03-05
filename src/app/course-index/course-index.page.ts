import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.page.html',
  styleUrls: ['./course-index.page.scss'],
})
export class CourseIndexPage implements OnInit {
  isExpanded1: boolean = false;
  isExpanded2: boolean = false;
  isExpanded3: boolean = false;
  isExpanded4: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClose(){
    this.router.navigate(['cyber-security']);
  }

  onClick(){
    this.router.navigate(['index-activity'])
  }

  onQuiz(){
    this.router.navigate(['index-quiz'])
  }

  toggleAccordion(value: any) {
    if (value === 1) {
      this.isExpanded1 = !this.isExpanded1;
    }
    if (value === 2) {
      this.isExpanded2 = !this.isExpanded2;
    }
    if (value === 3) {
      this.isExpanded3 = !this.isExpanded3;
    }
    if (value === 4) {
      this.isExpanded4 = !this.isExpanded4;
    }
  }
}
