import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const AUTH_API = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Custom-Header': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type,Access-Control-Allow-Headers,lang',
    'Access-Control-Allow-Origin': '*'
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: any;
  constructor(private http: HttpClient,private tokenService: TokenService) { 
    this.token = this.tokenService.getToken()
  }



  login(username: string, password: string): Observable<any> {
    let params = new HttpParams()
      .set('username', username)
      .set('password', password);
    console.log(params);

    return this.http.get(AUTH_API +
      'login/token.php?service=moodle_mobile_app',
      { params },
    );
  }

  validateEmail(email: any): Observable<any> {
    let params = new HttpParams().set('values[0]', email);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wstoken=418ad191d3346e9490d078712f066ed8&wsfunction=core_user_get_users_by_field&field=email',
      { params }
    );
  }

  sendOtp(phone: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'sendotp',
      phone: phone
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  loginViaOtp(phone: string, otp: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'verifyopt',
      phone: phone,
      votpid: otp,
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  expireOtp(phone: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'expiredOTP',
      phone: phone,
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  forgotPassword(email: any): Observable<any> {
    let params = new HttpParams().set('email', email);
    console.log(params);

    return this.http.get('https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_auth_request_password_reset&wstoken=8f1f644e5ed7d8d8fd587dba8856e2d2',
      { params }
    );
  }

  getUserInfo(id: any): Observable<any> {
    let params = new HttpParams().set('values[0]', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wstoken=418ad191d3346e9490d078712f066ed8&wsfunction=core_user_get_users_by_field&field=username',
      { params }
    );
  }

  getRecentCourses(): Observable<any> {
    // let params = new HttpParams().set('userid', id);
    // console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=block_recentlyaccesseditems_get_recent_items&wstoken=${this.token}`,
      // { params }
    );
  }

  getRecentCoursesByID(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'getModuleInstance',
      cmid: id
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  getCourses(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses&wstoken=${this.token}`,
      { params }
    );
  }

  getCoursesById(id: any): Observable<any> {
    let params = new HttpParams().set('value', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_courses_by_field&wstoken=${this.token}&field=id`,
      { params }
    );
  }

  getCalendarEvent(year: any, month: any): Observable<any> {
    let params = new HttpParams()
      .set('year', year)
      .set('month', month);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_calendar_get_calendar_monthly_view&wstoken=${this.token}`,
      { params }
    );
  }

  getCourseContent(id: any): Observable<any> {
    let params = new HttpParams().set('courseid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents&wstoken=${this.token}`,
      { params }
    );
  }

  getUserGrades(userId: any, courseId: any): Observable<any> {
    let params = new HttpParams()
      .set('userid', userId)
      .set('courseid', courseId);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=gradereport_user_get_grade_items&wstoken=${this.token}`,
      { params }
    );
  }

  getScormsByCourseId(id: any): Observable<any> {
    let params = new HttpParams().set('courseids[0]', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_scorm_get_scorms_by_courses&wstoken=${this.token}`,
      { params }
    );
  }


  isAttemptFinish(userid: any,quizid: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'isAttemptFinished',
      userid: userid,
      quiz: quizid
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }


  getUserToken(userid: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'getUserToken',
      userid: userid,
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  startQuizById(id: any): Observable<any> {
    let params = new HttpParams().set('quizid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_start_attempt&wstoken=${this.token}`,
      { params }
    );
  }

  getAttemptSummary(id: any): Observable<any> {
    let params = new HttpParams().set('attemptid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_attempt_summary&wstoken=${this.token}`,
      { params }
    );
  }

  getNotificationByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('useridto', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=message_popup_get_popup_notifications&wstoken=${this.token}`,
      { params }
    );
  }

  getGradesByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=gradereport_overview_get_course_grades&wstoken=${this.token}`,
      { params }
    );
  }

  getBadgesByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_badges_get_user_badges&wstoken=${this.token}`,
      { params }
    );
  }
}
