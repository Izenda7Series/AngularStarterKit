import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

@Injectable({ providedIn: 'root' })

export class IzendaApiService {

  private baseurl = 'http://localhost:8310/api/';  // Base URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })//, { 'token': localStorage.getItem("izendatoken") })
  };

  constructor(
    private http: HttpClient
  ) { }

  // GET objects from the server
  getObjects(targeturl): Observable<any[]> {
    return this.http.get<any[]>(targeturl)
      .pipe(
        tap(_ => this.log('fetched object')),
        catchError(this.handleError<any[]>('getObjects', []))
      );
  }
  APIGet(url: string, selectedTenant?: string, currentTenant?: string, sModule?: string) {
    if (url === null || url.trim().length === 0)
      return;
    let token = localStorage.getItem('izendatoken');
    let __headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access_token': token });//access_token: i7di+WoXTvjk47YhJGhictiBOqsUGIkbgd5B8XizEJ56DC4Ark8TO9YWUs50BH+HFnukB2H1pFZfza4psZCDOA==
    if (selectedTenant != null && selectedTenant != '') __headers.append('selected_tenant', selectedTenant);
    if (currentTenant != null && currentTenant != '') __headers.append('current_tenant', selectedTenant);
    let __options = { headers: __headers, withCredentials: false };

    if (sModule == null) sModule = "";

    if (!url.toLowerCase().startsWith('http:'))
      url = this.endPoint + (url.startsWith("/") ? "" : "/") + url;
    //TODO: remove
    this.log(url);
    return this.http.get(url, __options)// HttpSettings.GetDefaultHttpRequestOptions())
      .pipe( map( res => (res)));
  }
  APIPost(url: string, parData: any, sModule?: string) {
    if (url === null || url.trim().length === 0)
      return;
    let token = localStorage.getItem('izendatoken');
    let __headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access_token': token });//access_token: i7di+WoXTvjk47YhJGhictiBOqsUGIkbgd5B8XizEJ56DC4Ark8TO9YWUs50BH+HFnukB2H1pFZfza4psZCDOA==
    let __options = { headers: __headers, withCredentials: false };

    if (sModule == null) sModule = "";
    /*
    let data = {
      //"criteria": (parData == null ? "" : parData),
      // TBD: "sessionID": this.g.sessionToken,
      // TBD: "applicationID": environment.applicationID,
      //"module": sModule
      "criteria": (parData == null ? "" : parData),
    };*/

    if (!url.toLowerCase().startsWith('http:'))
      url = this.endPoint + (url.startsWith("/") ? "" : "/") + url;
this.log(url);
    return this.http.post(url, parData == null? "":parData, __options)// HttpSettings.GetDefaultHttpRequestOptions())
      .pipe(map(res =>(res)));
  /*    return this.http.post(url, data, __options).map(
      res => res.json()
    )//.catch(this.handleError)
*/
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to the custom logger
      console.error(error); // log to console instead

      // TODO: change with the custom logger
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /* Log an IzendaApiService message on console */
  private log(message: string) {
    //console.log('IzendaApiService: ${message}');
  }
  private get endPoint() {
    let __ep: string = "http://localhost:8310/api/";
    // TODO: Get endpoint based on the environment.ts settings
    return __ep;
  }
}


/*
 * import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
//import { GlobalComponent } from '../global.component'

import { DOCUMENT } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IzendaApiService {
  //sdate: string = Date.now().toString();
  //config: any;
  //shost: string = '';

  constructor(private http: HttpClient, private r: Router, @Inject(DOCUMENT) private document: any) { }

  APIPreLoginPost(url: string, urldata: string) {
    if (url == null || url == "null") return;
    let headers = new Headers({ 'Content-Type': 'application/json', 'AuthIgnore': true, 'AuthToken': environment.applicationID + ':' });
    let options = new RequestOptions({ headers: headers, withCredentials: false });

    if (!url.toLowerCase().startsWith('http:'))
      url = this.endPoint + "/pre" + (url.startsWith("/") ? "" : "/") + url;

    return this.http.post(url, urldata, options).map(
      res => res.json()
    ).catch(this.handleError)
  }

  APIPost(url: string, parData: any, sModule?: string) {
    if (url == null || url == "null") return;
    let headers = new Headers({ 'Content-Type': 'application/json', 'AuthToken': this.g.applicationID + ':' + this.g.sessionToken });
    let options = new RequestOptions({ headers: headers, withCredentials: false });

    if (sModule == null) sModule = "";

    let data = {
      "criteria": (parData == null ? "" : parData),
      "sessionID": this.g.sessionToken,
      "applicationID": environment.applicationID,
      "module": sModule
    };

    if (!url.toLowerCase().startsWith('http:'))
      url = this.endPoint + (url.startsWith("/") ? "" : "/") + url;

    return this.http.post(url, data, options).map(
      res => res.json()
    )//.catch(this.handleError)
  }

  private handleError(error: Response | any) {
    if (error instanceof Response) {
      let body: any = error.json() || '';
      const err = body.error || JSON.stringify(body);
      // TODO STUDY this before implementing it
      //return Promise.reject(`${error.status} - ${error.statusText || ''} ${err}`);
      return Promise.reject(error);
    }
    else {
      return Promise.reject(error);
    }
  }

  private get endPoint() {
    let __ep: string = "";
    if (this.document) {
      let __domain = this.document.location.hostname.toLowerCase();
      if (__domain == "localhost" || __domain == null || __domain == "")
        __ep = environment.fallBackAPIEndPoint;
      else {
        __ep = __domain.replace(environment.applicationBaseName, "api")
        if (!__ep.startsWith("http"))
          __ep = "https://" + __ep;

        let __i = __ep.indexOf(".")
        if (__i >= 0)
          __ep = __ep.substring(0, __i) + environment.apiDomain;

        __ep += "/api";
      }
    }
    return __ep;
  }
}
*/
