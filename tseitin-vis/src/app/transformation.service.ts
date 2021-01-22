import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {TransformationResponse} from './model/transformation-response';
import {TransformationRequest} from './model/transformation-request';

@Injectable({
  providedIn: 'root'
})
export class TransformationService {

  private url = 'http://localhost:5000/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(    private http: HttpClient  ) { }


  get(): Observable<TransformationResponse> {
    return this.http.get<TransformationResponse>(this.url)
      .pipe(
        tap(resp => console.log(resp)),
      );
  }

  post(cnf: string): Observable<TransformationResponse> {
    const request = new TransformationRequest();
    request.cnf = cnf;
    return this.http.post<TransformationResponse>(this.url, request, this.httpOptions).pipe(
      tap(resp => console.log(resp)),
    );
  }
}
