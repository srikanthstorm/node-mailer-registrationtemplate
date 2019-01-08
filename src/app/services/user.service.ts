import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders , HttpParams, } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { Users } from '../../../server/model/Users';
import { Globals }  from '../global';

     
@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  info: any;
  constructor(private http: HttpClient,private globals: Globals ) { }
  // add User
  addUser(user: Users): Observable<Users> {
    return this.http.post(this.globals.backendURL + '/addUser', JSON.stringify(user), { headers: this.globals.headers})
      .map((response: Response) => {
      return response;
    });
   }
   //list of all users
   getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.globals.backendURL + '/Users')  .pipe(
      tap( User => this.log(``)),
      catchError(this.handleError('getUsers', []))
    );
  }
  // Users by ID
  getUserbyID(id): Observable<Users[]> {
    return this.http.get<Users[]>(this.globals.backendURL + '/Users' +'/' + id)  .pipe(
        tap( user => this.log(``)),
        catchError(this.handleError('getFeedbyID', []))
    );
}
// By Status
getUsersbyStatus(status): Observable<Users[]> {
  return this.http.get<Users[]>(this.globals.backendURL+ '/UsersStatus/' + status)  .pipe(
      tap( rssfeed => this.log(``)),
      catchError(this.handleError('getFeedbyStatus', []))
  );
}
  //deactivate User
  deactivateUser(id: Users) {
      return this.http.put(this.globals.backendURL + '/user/deactivate/' + id , { headers: this.globals.headers})
          .map(response => {
              // login successful if there's a jwt token in the response
              if (response ) {
              }
              return response;
          });
        
}
  //re activate User
  reactivateUser(id: Users) {
    return this.http.put(this.globals.backendURL + '/user/reactivate/' + id , { headers: this.globals.headers})
        .map(response => {
            // login successful if there's a jwt token in the response
            if (response ) {
            }
            return response;
        });
}
//deactivate Many User
deactivateMany(id: Users) {
  return this.http.put(this.globals.backendURL + '/user/deactivateMany/' + id , { headers: this.globals.headers})
      .map(response => {
          // login successful if there's a jwt token in the response
          if (response ) {
          }
          return response;
      });
    
}
// update User
updateUser(user : Users): Observable<Users> | any {
  return this.http.put(this.globals.backendURL + '/User/update', JSON.stringify(user), { headers: this.globals.headers})
   .map(response => {
      return response;
    })
    .catch(error => {
      return Observable.throw(error);
    });
}
// update Password
updatePassword(data : Users): Observable<Users> | any {
  return this.http.put(this.globals.backendURL + '/User/updatePassword/', JSON.stringify(data), { headers: this.globals.headers})
   .map(response => {
      return response;
    })
    .catch(error => {
      return Observable.throw(error);
    });
}
//update Preferences
updatePreferences(id: Users, user_keywords: Users, user_stockCodes: Users): Observable<Users> | any {
  const params = new HttpParams()
      .set('user_keywords', user_keywords)
      .set('user_stockCodes', user_stockCodes);
  return this.http.put(this.globals.backendURL + '/users/' + id + '/' + user_keywords +  '/' + user_stockCodes , {params: params} )
.map(response => {
// login successful if there's a jwt token in the response
if (response ) {
}
return response;
});
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
  }
}
