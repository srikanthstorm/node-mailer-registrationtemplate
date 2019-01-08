import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders , HttpParams, } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { Source } from '../../../server/model/source';
import { Globals }  from '../global';


@Injectable({
  providedIn: 'root'
})

export class SourcesService {
  
  constructor(private http: HttpClient,private globals: Globals  ) { }
  // list of all source
  getSources(): Observable<Source[]> {
    return this.http.get<Source[]>(this.globals.backendURL + '/Source')  .pipe(
      tap(source => this.log(``)),
      catchError(this.handleError('getSources', []))
    );
  }
  //source by status
  getSourcebyStatus(status): Observable<Source[]> {
    return this.http.get<Source[]>(this.globals.backendURL + '/Source/' + status)  .pipe(
        tap( rssfeed => this.log(``)),
        catchError(this.handleError('getFeedbyStatus', []))
    );
}
// update Sources
updateSource(data : Source): Observable<Source> | any {
  return this.http.put(this.globals.backendURL + '/source/update', JSON.stringify(data), { headers: this.globals.headers})
   .map(response => {
      return response;
    })
    .catch(error => {
      return Observable.throw(error);
    });
}
//add Source
addSource(source: Source): Observable<Source> {
  console.log(typeof source.api_key)
  if (typeof source.api_key !== 'undefined'){
   
  } else{
    source.api_key = '';
  }
   return this.http.post(this.globals.backendURL + '/addSource', JSON.stringify(source) , { headers: this.globals.headers})
    .map((response: Response) => {
    return response;
  }); 
 }
  // deactivate source
  deactivateSource(id: Source) {
      return this.http.put(this.globals.backendURL + '/source/deactivate/' + id , { headers: this.globals.headers})
          .map(response => {
              // login successful if there's a jwt token in the response
              if (response ) {
              }
              return response;
          });
}
//deactivate Many DOurces
deactivateMany(id: Source) {
    return this.http.put(this.globals.backendURL + '/Source/ignoreMany/' + id , { headers: this.globals.headers})
        .map(response => {
            // login successful if there's a jwt token in the response
            if (response ) {
            }
            return response;
        });
}
  //re activate User
  reactivateSource(id: Source) {
    return this.http.put(this.globals.backendURL + '/source/reactivate/' + id , { headers: this.globals.headers})
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
