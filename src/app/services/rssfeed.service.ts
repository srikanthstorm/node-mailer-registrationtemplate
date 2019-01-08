import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders , HttpParams, } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import 'rxjs/add/operator/map';
import {catchError, map, tap} from 'rxjs/operators';
import { Rssfeed } from '../../../server/model/rssfeed';
import { Globals }  from '../global';
@Injectable({
  providedIn: 'root'
})

export class RssfeedService {
  
  info: any;
  constructor(private http: HttpClient,private globals: Globals  ) { 
    
  }
  // list of all feeds
  getFeeds(): Observable<Rssfeed[]> {
    return this.http.get<Rssfeed[]>(this.globals.backendURL + '/untaggedFeeds')  .pipe(
      tap( rssfeed => this.log(``)),
      catchError(this.handleError('getFeeds', []))
    );
  }
  // Feeds by ID
  getFeedbyID(id): Observable<Rssfeed[]> {
    return this.http.get<Rssfeed[]>(this.globals.backendURL + '/rssfeed/' + id)  .pipe(
        tap( rssfeed => this.log(``)),
        catchError(this.handleError('getFeedbyID', []))
    );
  } 
    //oldest feed by source
    getOldestbySource(articles_source_name): Observable<Rssfeed[]> {
      return this.http.get<Rssfeed[]>(this.globals.backendURL + '/rssFeed/oldestUntagged/' + articles_source_name)  .pipe(
        tap( rssfeed => this.log(``)),
        catchError(this.handleError('getOldestbySource', []))
    );
    
    }
//feed by status
    getFeedbyStatus(feed_status): Observable<Rssfeed[]> {
        return this.http.get<Rssfeed[]>(this.globals.backendURL + '/statusFeeds/' + feed_status)  .pipe(
            tap( rssfeed => this.log(``)),
            catchError(this.handleError('getFeedbyStatus', []))
        );
    }
    //feed by date
    getFeedbyDate(feed_date): Observable<Rssfeed[]> {
      return this.http.get<Rssfeed[]>(this.globals.backendURL + '/rssFeedsbyDate/' + feed_date)  .pipe(
          tap( rssfeed => this.log(``)),
          catchError(this.handleError('getFeedbyStatus', []))
      );
  }
    //Feeds by oldest
    getFeedsOldestOne(): Observable<Rssfeed[]> {
        return this.http.get<Rssfeed[]>(this.globals.backendURL + '/untaggedFeedsOldest')  .pipe(
          tap( rssfeed => this.log(``)),
          catchError(this.handleError('getFeedsOldestOne', [])),
        );
    }
    // update Status
    updateStatus(_id: Rssfeed, primary_keyword: Rssfeed, keyword: Rssfeed, stockcode: Rssfeed) {
      const params = new HttpParams()
          .set('primary_keyword',primary_keyword)
          .set('keyword', keyword)
          .set('stockcode', stockcode);
    return this.http.put(this.globals.backendURL + '/rssfeed/' + _id + '/' + primary_keyword +  '/' + keyword +  '/' + stockcode , {params: params} )
    .map(response => {
    // login successful if there's a jwt token in the response
    if (response ) {
    }
    return response;
    });
    }
    // update Status as Ignore
    ignoreFeed(id: Rssfeed) {
      
        return this.http.put(this.globals.backendURL + '/rssfeed/ignore/' + id , { headers: this.globals.headers})
            .map(response => {
                // login successful if there's a jwt token in the response
                if (response ) {
                }
                return response;
            });
    }
    ignoreManyFeeds(feed: Rssfeed) {
      return this.http.put(this.globals.backendURL + '/rssfeed/ignoreMany/' + feed, { headers: this.globals.headers})
      .map((response: Response) => {
        return response;
     });  
  }
    // Add new feed
    addFeed(rssfeed: Rssfeed) {
      return this.http.post(this.globals.backendURL + '/rssfeed/new', JSON.stringify(rssfeed), { headers: this.globals.headers})
      .map((response: Response) => {
       return response;
     });
    }
//count of sources
countSources(){
  return this.http.get<Rssfeed[]>(this.globals.backendURL + '/sources/count')  .pipe(
    tap( rssfeed => this.log(``)),
    catchError(this.handleError('countSources', []))
  );
}
//count of untaggedFeeds
countTotalFeeds(){
  return this.http.get<Rssfeed[]>(this.globals.backendURL + '/feeds/count')  .pipe(
    tap( rssfeed => this.log(``)),
    catchError(this.handleError('countTotalFeeds', []))
  );
}
    //main page feeds
    mainPage(feed_status,articles_source_name, article_publishedAt): Observable<Rssfeed[]> {
       return this.http.get<Rssfeed[]>(this.globals.backendURL + '/rssFeed/mainPage/' + feed_status +'/'+ articles_source_name+'/'+article_publishedAt)  .pipe(
          tap( rssfeed => this.log(``)),
          catchError(this.handleError('mainPage', []))
      );
  }
        // send email
  sendEmail(feed): Observable<Response[]> {
    return this.http.get<Response[]>(this.globals.backendURL + '/sendEmail/' + feed, { headers: this.globals.headers})  .pipe(
      tap( info => this.log(``)),
      catchError(this.handleError('sendEmail', []))
    );

  } 
  autoTagFeeds(){
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*'
      })
    };
    return this.http.get(this.globals.backendURL + '/autoTagStories') .pipe(
      map( info => this.log(``)),
      catchError(this.handleError('autoTagFeeds', []))
    );
  }
 /*  testFunction() {
    return 'Hi';
  } */
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

