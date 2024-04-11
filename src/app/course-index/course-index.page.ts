import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.page.html',
  styleUrls: ['./course-index.page.scss'],
})
export class CourseIndexPage implements OnInit {
  isExpanded: boolean[] = [];
  data: any;
  courseData: any;
  scormData: any;
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
            console.error(error);
          },
        });
      }
    });
    this.getScorms();
  }

  getScorms() {
    this.authService.getScormsByCourseId(this.data.id).subscribe({
      next: (data) => {
        console.log(data);
        this.scormData = data.scorms;

      },
      error: (error) => {
        console.error('Login failed:', error);
      },
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
      localStorage.setItem('quizName',value.name)
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(value.instance),
        },
      };
      this.router.navigate(['index-quiz'],navigationExtras)
    }
    if(value.modname === 'page'){
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(value),
        },
      };
      this.router.navigate(['index-activity'],navigationExtras)
    }
    if (value.modname === 'scorm') {
      console.log(this.scormData);
      this.scormData.forEach((scorm: any) => {
        this.courseData.find((module: any) => module.modules.some((item: any) => {
          // console.log((item.instance === scorm.id) === true);
          
          if((item.instance === scorm.id) === true){
            Browser.open({ url: `https://uat-gurukul.skfin.in/mod/scorm/player.php?a=${item.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
          }
        }
        ));
      });
    }
  }

  toggleAccordion(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }
}
