import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders , HttpParams, } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Users} from '../../../server/model/Users';
import { Globals }  from '../global';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn')|| 'false');

  constructor(private http: HttpClient,private globals: Globals  ) { }

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true')
  }
  get isLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString());
  }
  login(username: Users, password: Users) {
    return this.http.get(this.globals.backendURL + '/Users/' + username + '/' + password ,  { headers: this.globals.headers})
    .pipe(
      tap( User => this.log(``)),
      catchError(this.handleError('getUsers', []))
    );
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
  }

private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead
    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
private log(s: string) {
  console.log(s);
}
}
