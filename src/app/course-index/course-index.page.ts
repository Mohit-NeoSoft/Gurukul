import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.page.html',
  styleUrls: ['./course-index.page.scss'],
})
export class CourseIndexPage implements OnInit {
  isExpanded: boolean[] = [];
  data: any;
  courseData: any;
  constructor(private router: Router,private route: ActivatedRoute,private authService: AuthService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params && params.data) {
        this.data = JSON.parse(params.data);
        this.authService.getCourseContent(this.data.id).subscribe({
          next: (data) => {
            this.courseData = data;
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
        });
      }
    });
  }

  onClose(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.data),
      },
    };
    this.router.navigate(['cyber-security'],navigationExtras);
  }

  onClick(value: any){
    console.log(value);
    if(value.modname === 'quiz'){
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(value.instance),
        },
      };
      this.router.navigate(['index-quiz'],navigationExtras)
    }
    // this.router.navigate(['index-activity'])
  }

  // onQuiz(){
  //   this.router.navigate(['index-quiz'])
  // }

  toggleAccordion(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }
}
