import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-attempt-summary',
  templateUrl: './attempt-summary.page.html',
  styleUrls: ['./attempt-summary.page.scss'],
})
export class AttemptSummaryPage implements OnInit {
  attemptData: any;
  attemptId: any;
  finishAttempt: any;
  attempResult: any;
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
  constructor(private menuCtrl: MenuController, private router: Router, private route: ActivatedRoute,
    private http: HttpClient) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);

      if (params && params.data) {
        this.attemptData = JSON.parse(params.data);
        this.attemptId = JSON.parse(params.id);
        console.log(this.attemptData);

      }
    });
  }

  ngOnInit() {
  }

  onBookmark() {
    this.menuCtrl.open('attemptMenu');
  }

  onClose() {
    this.menuCtrl.close('attemptMenu');
  }

  onSubmit() {
    let k = 0;
    console.log(this.attemptData);
    for (let j = this.attemptData.length - 1; j >= 0; j--) {
      if (Number(this.attemptData[j].answer) !== -1) {
        k = j
        break
      }
    }
    console.log(k);
    debugger;
    for (let i = 0; i < this.attemptData.length; i++) {
      console.log('attempt data----', this.attemptData[i].answer);

      if (Number(this.attemptData[i].answer) !== -1) {
        console.log('value of i------', i);
        console.log('check');
        setTimeout(() => {
          this.http.get(`https://uat-gurukul.skfin.in/webservice/rest/server.php?attemptid=${this.attemptId}&data[0][name]=slot&data[0][value]=${this.attemptData[i].slot}&data[1][name]=q${(this.attemptData[i].questionId.split("-"))[1]}:${this.attemptData[i].slot}_answer&data[1][value]=${this.attemptData[i].answer}&data[2][name]=q${(this.attemptData[i].questionId.split("-"))[1]}:${this.attemptData[i].slot}_:sequencecheck&data[2][value]=1&finishattempt=${i === k ? 1 : 0}&wsfunction=mod_quiz_process_attempt&wstoken=49d7377b1cffbbb4934972997a435bca`).subscribe((res: any) => {
            console.log(res);
          })
        }, 2000)

      }
    }
    // setTimeout(() => {
    //   this.http.get(`https://uat-gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_attempt_review&wstoken=49d7377b1cffbbb4934972997a435bca&attemptid=${this.attemptId}&page=1`).subscribe((res: any) => {
    //     console.log(res);
    //     this.attempResult = res.grade
    //     console.log(this.attempResult);

    //   })
    // },5000)

    // if (this.attempResult !== undefined) {
    //   debugger;
    //   let navigationExtras: NavigationExtras = {
    //     queryParams: {
    //       data: JSON.stringify(this.attempResult),
    //     },
    //   };
    //   this.router.navigate(['index-quiz'],navigationExtras)
    // }
  }
}
