import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// const AUTH_API = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'X-Custom-Header': 'application/json',
    'Access-Control-Allow-Headers':
      'Content-Type,Access-Control-Allow-Headers,lang',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    let params = new HttpParams()
      .set('username', username)
      .set('password', password);
    console.log(params);

    return this.http.get(
      'https://gurukul.skfin.in/login/token.php?service=moodle_mobile_app',
      { params },
    );
  }

  getCourses(): Observable<any> {
    // let params = new HttpParams().set('wstoken', token);
    // console.log(params);

    return this.http.get(
      'https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_courses&wstoken=f8f425a03f114d2699492766bb5bf1fd',
      // { params }
    );
  }
}
