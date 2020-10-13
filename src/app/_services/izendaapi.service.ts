/*  IzendaApiService.
    This demo service provides all the functionality necessary for the front end components to communicate
    with the Izenda application services.
    The service is responsible for handling the API calls and forming the header(s) correctly.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiEndpointConfig } from '../ApiEndpointConfig';

@Injectable({ providedIn: 'root' })

export class IzendaApiService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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
  APIGet(route: string, selectedTenant?: string, currentTenant?: string, sModule?: string) {
    if (route === null || route.trim().length === 0)
      return;
    let token = localStorage.getItem('izendatoken');
    let request_headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access_token': token });
    if (selectedTenant != null && selectedTenant != '') request_headers.append('selected_tenant', selectedTenant);
    if (currentTenant != null && currentTenant != '') request_headers.append('current_tenant', selectedTenant);
    let request_options = { headers: request_headers, withCredentials: false };

    if (sModule == null) sModule = "";
    let url: string = route;
    if (!url.toLowerCase().startsWith('http:'))
      url = this.endPoint + (url.startsWith("/") ? "" : "/") + url;
    return this.http.get(url, request_options)
      .pipe( map( res => (res)));
  }
  APIPost(route: string, parData: any, sModule?: string) {
    if (route === null || route.trim().length === 0)
      return;
    let token = localStorage.getItem('izendatoken');
    let request_headers = new HttpHeaders({ 'Content-Type': 'application/json', 'access_token': token });
    let request_options = { headers: request_headers, withCredentials: false };

    if (sModule == null) sModule = "";
    let url: string = route;
    if (!url.toLowerCase().startsWith('http:'))
      url = this.endPoint + (url.startsWith("/") ? "" : "/") + url;
    return this.http.post(url, parData == null? "":parData, request_options)
      .pipe(map(res =>(res)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Within this demo application, we do not implement advanced error handling but
      // in your implementation, you can change this with the custom handling
      this.log('${operation} failed: ${error.message}');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /* Log an IzendaApiService message */
  private log(message: string) {
      // Within this demo application, we do not implement advanced error handling but
      // in your implementation, you can implement the custom logger here.
  }
  private get endPoint() {
    return ApiEndpointConfig.getPath('izendaAPI');
  }
}
