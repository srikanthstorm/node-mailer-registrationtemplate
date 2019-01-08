import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders , HttpParams, } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import 'rxjs/add/operator/map';
import {catchError, map, tap} from 'rxjs/operators';
import { Rssfeed } from '../../../server/model/rssfeed';
import { Globals }  from '../global';
import { Response } from 'selenium-webdriver/http';


@Injectable({
  providedIn: 'root'
})


export class PipelinesService {
   headers = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  .append("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
  .append('Access-Control-Allow-Origin', '*')
  .append("Authorization", "Basic " + btoa("admin:admin"));
  info: any;
  constructor(private http: HttpClient,private globals: Globals  ) {     
  }

  getStatus(){
    return this.http.get(this.globals.backendURL + '/getPipestatus', { headers: this.headers})  
    .pipe(
      tap( result => this.log(``)),
      catchError(this.handleError('getStatus', [])),
    );
  }
  getPipelineStatus(pipelineId){
    return this.http.get(this.globals.backendURL + '/getPipestatus/byID/' + pipelineId, { headers: this.headers})  
    .pipe(
      tap( result => this.log(``)),
      catchError(this.handleError('getPipelineStatus', [])),
    );
    
  }
  startStatus(pipelineId){
    return this.http.put(this.globals.backendURL + '/startPipeline/' + pipelineId, { headers: this.globals.headers})
    .map(response => {
       return response;
     })
     .catch(error => {
       return Observable.throw(error);
     });
 }
 stopStatus(pipelineId){
  return this.http.put(this.globals.backendURL + '/stopPipeline/' + pipelineId, { headers: this.globals.headers})
  .map(response => {
     return response;
   })
   .catch(error => {
     return Observable.throw(error);
   });
}
createPipeline(id) {
  return this.http.post(this.globals.backendURL + '/createPipeline/' + id , { headers: this.globals.headers})
    .map((response: Response) => {
    return response;
  });
}
createPipelineforExisting(sourceData) {
  return this.http.put(this.globals.backendURL + '/createPipelineforExisting/' + sourceData, { headers: this.globals.headers})
    .map((response: Response) => {
    return response;
  }); 
}
startAllPipelines(){
  return this.http.post(this.globals.backendURL + '/startAllPipelines', { headers: this.headers})  
  .pipe(
    tap( result => this.log(``)),
    catchError(this.handleError('startAllPipelines', [])),
  );
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
   // console.log(s);
  }

}


