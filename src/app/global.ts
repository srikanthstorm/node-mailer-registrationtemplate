import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders , HttpParams, } from '@angular/common/http';

@Injectable()
export class Globals {
backendURL : string = 'http://34.229.53.92:3003';
//backendURL : string = 'http://localhost:3003';
  headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');

  statuss = [
    {value: 'active', viewValue: 'Active'},
    {value: 'deactive', viewValue: 'Deleted'}
  ];

}
