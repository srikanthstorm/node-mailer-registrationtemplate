import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders , HttpParams, } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { Keywords } from '../../../server/model/keywords';
import { StockCodes } from '../../../server/model/stockCodes';
import { Globals }  from '../global';


@Injectable({
  providedIn: 'root'
})
export class TagsService {

  
  private keywordURL = '/Keywords';
  private stockCodeURL= '/StockCodes';
  constructor(private http: HttpClient,private globals: Globals  ) { }

  // list of all Keyword
  getKeywords(): Observable<Keywords[]> {
    return this.http.get<Keywords[]>(this.globals.backendURL + this.keywordURL)  .pipe(
      tap( Keyword => this.log(``)),
      catchError(this.handleError('getKeywords', []))
    );
  }
    //source by status
    getKeywordsbyStatus(status): Observable<Keywords[]> {
      return this.http.get<Keywords[]>(this.globals.backendURL + '/keywords/' + status)  .pipe(
          tap( rssfeed => this.log(``)),
          catchError(this.handleError('getFeedbyStatus', []))
      );
  }
 // deactivate Keyword
 deactivateKeywords(keyword_name: Keywords) {
    return this.http.put(this.globals.backendURL + '/keywords/deactivate/' + keyword_name , { headers: this.globals.headers})
        .map(response => {
            // login successful if there's a jwt token in the response
            if (response ) {
            }
            return response;
        });
}
activateKeywords(keyword_name: Keywords) {
  return this.http.put(this.globals.backendURL + '/keywords/activate/' + keyword_name , { headers: this.globals.headers})
      .map(response => {
          // login successful if there's a jwt token in the response
          if (response ) {
          }
          return response;
      });
}
//add Keywords 
addKeyword(keyword: Keywords): Observable<Keywords> {
  return this.http.post(this.globals.backendURL + '/addKeyword', JSON.stringify(keyword), { headers: this.globals.headers})
    .map((response: Response) => {
    return response;
  });
 }
 //update Keywords
 updateKeyword(data : Keywords): Observable<Keywords> | any {
  return this.http.put(this.globals.backendURL + '/Keywords/update', JSON.stringify(data), { headers: this.globals.headers})
   .map(response => {
      return response;
    })
    .catch(error => {
      return Observable.throw(error);
    });
}
// list of all stockCodes
getStockCodes(): Observable<StockCodes[]> {
  return this.http.get<StockCodes[]>(this.globals.backendURL + this.stockCodeURL)  .pipe(
    tap( Keyword => this.log(``)),
    catchError(this.handleError('getKeywords', []))
  );
}
  //source by status
  getStockbyStatus(status): Observable<StockCodes[]> {
    return this.http.get<StockCodes[]>(this.globals.backendURL + '/stockCode/' + status)  .pipe(
        tap( rssfeed => this.log(``)),
        catchError(this.handleError('getFeedbyStatus', []))
    );
}
deactivateStockCode(id: StockCodes) {
    return this.http.put(this.globals.backendURL + '/stockCode/deactivate/' + id , { headers: this.globals.headers})
        .map(response => {
            // login successful if there's a jwt token in the response
            if (response ) {
            }
            return response;
        });
}
//deactivate many stock Codes
deactivateManyStockCode(id: StockCodes) {
  return this.http.put(this.globals.backendURL + '/stockCodes/ignoreMany/' + id , { headers: this.globals.headers})
      .map(response => {
          // login successful if there's a jwt token in the response
          if (response ) {
          }
          return response;
      });
}
//updateStockCode
updateStockCode(data : StockCodes): Observable<StockCodes> | any {
  return this.http.put(this.globals.backendURL + '/stockCode/update', JSON.stringify(data), { headers: this.globals.headers})
   .map(response => {
      return response;
    })
    .catch(error => {
      return Observable.throw(error);
    });
}
//add Stcok Code
addStockCode(stockCode: StockCodes): Observable<StockCodes> {
  return this.http.post(this.globals.backendURL + '/addStockCode', JSON.stringify(stockCode), { headers: this.globals.headers})
    .map((response: Response) => {
    return response;
  });
 }
   //re activate User
   reactivateStockCode(id: StockCodes) {
    return this.http.put(this.globals.backendURL + '/stockCode/reactivate/' + id , { headers: this.globals.headers})
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

