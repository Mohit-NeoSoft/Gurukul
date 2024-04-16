import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  showNext: boolean = false;
  attemptId: any;
  quizData: any;
  extractedValues: any[]=[];
  // objString = '<div id="question-13753-1" class="que multichoice deferredfeedback notyetanswered"><div class="info"><h3 class="no">Question <span class="qno">1</span></h3><div class="state">Not yet answered</div><div class="grade">Marked out of 1.00</div><div class="questionflag editable"><input type="hidden" name="q13753:1_:flagged" value="0" /><input type="hidden" value="qaid=157879&amp;qubaid=13753&amp;qid=2011&amp;slot=1&amp;checksum=7bf40599429aa3dfc246319370422197&amp;sesskey=c8RKLrxUDi&amp;newstate=" class="questionflagpostdata" /><input type="checkbox" id="q13753:1_:flaggedcheckbox" name="q13753:1_:flagged" value="1" /><label id="q13753:1_:flaggedlabel" for="q13753:1_:flaggedcheckbox"><img src="https://uat-gurukul.skfin.in/theme/image.php/adaptable/core/1707822755/i/unflagged" alt="" class="questionflagimage" id="q13753:1_:flaggedimg" /><span>Flag question</span></label>\n</div></div><div class="content"><div class="formulation clearfix"><h4 class="accesshide">Question text</h4><input type="hidden" name="q13753:1_:sequencecheck" value="1" /><div class="qtext">As per SK Password norms, your password should be a minimum of _________in length</div><div class="ablock no-overflow visual-scroll-x"><div class="answer"><div class="r0"><input type="radio" name="q13753:1_answer" value="0" id="q13753:1_answer0" aria-labelledby="q13753:1_answer0_label" /><div class="d-flex w-auto" id="q13753:1_answer0_label" data-region="answer-label"><span class="answernumber">a. </span><div class="flex-fill ml-1">6 character</div></div> </div>\n<div class="r1"><input type="radio" name="q13753:1_answer" value="1" id="q13753:1_answer1" aria-labelledby="q13753:1_answer1_label" /><div class="d-flex w-auto" id="q13753:1_answer1_label" data-region="answer-label"><span class="answernumber">b. </span><div class="flex-fill ml-1">7 character</div></div> </div>\n<div class="r0"><input type="radio" name="q13753:1_answer" value="2" id="q13753:1_answer2" aria-labelledby="q13753:1_answer2_label" /><div class="d-flex w-auto" id="q13753:1_answer2_label" data-region="answer-label"><span class="answernumber">c. </span><div class="flex-fill ml-1">8 character</div></div> </div>\n<div class="r1"><input type="radio" name="q13753:1_answer" value="3" id="q13753:1_answer3" aria-labelledby="q13753:1_answer3_label" /><div class="d-flex w-auto" id="q13753:1_answer3_label" data-region="answer-label"><span class="answernumber">d. </span><div class="flex-fill ml-1">12 character</div></div> </div>\n</div><div id="q13753:1_clearchoice" class="qtype_multichoice_clearchoice sr-only" aria-hidden="true"><input type="radio" name="q13753:1_answer" id="q13753:1_answer-1" value="-1" class="sr-only" aria-hidden="true" checked="checked" /><label for="q13753:1_answer-1"><a tabindex="-1" role="button" class="btn btn-link ml-3 mt-n1 mb-n1" href="#\">Clear my choice</a></label></div></div></div></div></div>'
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

  constructor(private menuCtrl: MenuController, private router: Router, private route: ActivatedRoute, private authService: AuthService, public sanitizer: DomSanitizer, private renderer: Renderer2) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);

      if (params && params.data) {
        this.attemptId = JSON.parse(params.data);
        this.authService.getAttemptSummary(this.attemptId).subscribe({
          next: (data) => {
            console.log(data);
            
            // this.quizData = data.questions;
            this.quizData = data.questions.map((question: any) => ({
              ...question,
              sanitizedHtml: this.sanitizer.bypassSecurityTrustHtml(question.html.replace(/href=\"#\"/g, 'style="color: #212529;text-decoration: none"'))
            }));
            this.executeScripts();
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
        });
      }
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  executeScripts() {
    this.quizData.forEach((question: any) => {
      const script = this.renderer.createElement('script');
      // script.text = question.html.match(/<script>([\s\S]*)<\/script>/)[1];
      this.renderer.appendChild(document.body, script);
    });
  }

  extractValues() {
    const questions = document.querySelectorAll<HTMLDivElement>('.que');
    console.log(questions);
    
    questions.forEach((question, index) => {
      console.log(question);
      console.log(index);
      
      const questionNumber = index + 1;
      const selectedRadio = question.querySelector<HTMLInputElement>('input[type="radio"]:checked');
      const selectedCheckbox = question.querySelector<HTMLInputElement>('input[type="checkbox"]:checked');
  
      const questionValues: { [key: string]: string } = {
        slot: questionNumber.toString(),
        questionId: question.id,
        answer: selectedRadio ? selectedRadio.value : 'Not answered',
        flag: selectedCheckbox ? selectedCheckbox.value : 'Not answered'
      };
      this.extractedValues.push(questionValues);
    });
    console.log(this.extractedValues);
    
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

  onNext() {
   this.extractValues();    
   let navigationExtras: NavigationExtras = {
    queryParams: {
      id: this.attemptId,
      data: JSON.stringify(this.extractedValues),
    },
  };
    this.router.navigate(['attempt-summary'],navigationExtras);
  }

  onClose() {
    this.menuCtrl.close('quizMenu');
  }

  onSubmit() {
    this.router.navigate(['index-quiz'])
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
