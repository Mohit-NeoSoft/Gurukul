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

  validateEmail(email: any): Observable<any> {
    let params = new HttpParams().set('values[0]', email);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wstoken=47527b5daf6f0ee9090811eba184894a&wsfunction=core_user_get_users_by_field&field=email',
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

    return this.http.get('https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_auth_request_password_reset&wstoken=8f1f644e5ed7d8d8fd587dba8856e2d2',
      { params }
    );
  }

  getUserInfo(id: any): Observable<any> {
    let params = new HttpParams().set('values[0]', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wstoken=47527b5daf6f0ee9090811eba184894a&wsfunction=core_user_get_users_by_field&field=username',
      { params }
    );
  }

  getCourses(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses&wstoken=47527b5daf6f0ee9090811eba184894a',
      { params }
    );
  }
  
  getCourseContent(id: any): Observable<any> {
    let params = new HttpParams().set('courseid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents&wstoken=47527b5daf6f0ee9090811eba184894a',
      { params }
    );
  }

  getUserGrades(userId: any, courseId: any): Observable<any> {
    let params = new HttpParams()
    .set('userid', userId)
    .set('courseid', courseId);
  console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=gradereport_user_get_grade_items&wstoken=47527b5daf6f0ee9090811eba184894a',
      { params }
    );
  }

  startQuizById(id: any): Observable<any> {
    let params = new HttpParams().set('quizid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_start_attempt&wstoken=47527b5daf6f0ee9090811eba184894a',
      { params }
    );
  }

  getAttemptSummary(id: any): Observable<any> {
    let params = new HttpParams().set('attemptid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_attempt_summary&wstoken=47527b5daf6f0ee9090811eba184894a',
      { params }
    );
  }

  getNotificationByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('useridto', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=message_popup_get_popup_notifications&wstoken=47527b5daf6f0ee9090811eba184894a',
      { params }
    );
  }

  getGradesByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=gradereport_overview_get_course_grades&wstoken=47527b5daf6f0ee9090811eba184894a',
      { params }
    );
  }

  getBadgesByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      'webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_badges_get_user_badges&wstoken=47527b5daf6f0ee9090811eba184894a',
      { params }
    );
  }
}
