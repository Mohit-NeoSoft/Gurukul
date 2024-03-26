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
  constructor(private http: HttpClient) { }

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

  loginViaOtp(phone: string,otp: string) {
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

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_auth_request_password_reset&wstoken=0d1df9b1758999248b6ca0cadd1d117d',
      { params }
    );
  }

  getUserInfo(id: any): Observable<any> {
    let params = new HttpParams().set('values[0]', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wstoken=49d7377b1cffbbb4934972997a435bca&wsfunction=core_user_get_users_by_field&field=username',
      { params }
    );
  }

  getCourses(): Observable<any> {
    // let params = new HttpParams().set('wstoken', token);
    // console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wstoken=49d7377b1cffbbb4934972997a435bca&wsfunction=core_course_get_courses_by_field',
      // { params }
    );
  }

  getCourseContent(id: any): Observable<any> {
    let params = new HttpParams().set('courseid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents&wstoken=49d7377b1cffbbb4934972997a435bca',
      { params }
    );
  }

  startQuizById(id: any): Observable<any> {
    let params = new HttpParams().set('quizid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_start_attempt&wstoken=49d7377b1cffbbb4934972997a435bca',
      { params }
    );
  }

  getAttemptSummary(id: any): Observable<any> {
    let params = new HttpParams().set('attemptid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_attempt_summary&wstoken=49d7377b1cffbbb4934972997a435bca',
      { params }
    );
  }

  getNotificationByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('useridto', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=message_popup_get_popup_notifications&wstoken=49d7377b1cffbbb4934972997a435bca',
      { params }
    );
  }

  getGradesByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=gradereport_overview_get_course_grades&wstoken=49d7377b1cffbbb4934972997a435bca',
      { params }
    );
  }

  getBadgesByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_badges_get_user_badges&wstoken=49d7377b1cffbbb4934972997a435bca',
      { params }
    );
  }
}
