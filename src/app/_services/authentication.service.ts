/*  AuthenticationService.
    This demo service provides all the functionality necessary for the front end components to communicate
    with the authentication application (in our case, it is the WebApi2StarterKit application).
    The service is responsible for handling the token - related operations
    as well as for handling the calls that pass the data to the Authentication application
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiEndpointConfig } from '../ApiEndpointConfig';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  public token: string;
  public currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('currentUser'));
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAdminSubject = new BehaviorSubject<boolean>(this.checkIsAdmin());

  constructor(private httpClient: HttpClient, private router: Router) {
      // set token if saved in local storage
      this.token =  localStorage.getItem('tokenKey');
  }

  login(tenantname: string, username: string, password: string): Observable<boolean> {
      const url: string = ApiEndpointConfig.getPath('login');

      let authHttpParams  = new HttpParams()
          .set('grant_type', 'password')
          .set('username', username)
          .set('password', password);

      if (tenantname) {
        authHttpParams = authHttpParams.append('tenant', tenantname);
      }
      const body = authHttpParams.toString();

      const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      };

      return this.httpClient.post(url, body, httpOptions)
          .pipe(map((response) => {
              const token = response && response['access_token'];
              console.log('Integrated access token: ' + token);
              if (token) {
                  this.token = token;
                  localStorage.setItem('currentUser', username);
                  localStorage.setItem('tokenKey', token);
                  this.getIzendaToken(token);

                  // Notify is authenticated
                  this.isAuthenticatedSubject.next(true);
                  this.currentUserSubject.next(username);
                  this.isAdminSubject.next(this.checkIsAdmin());
                  return true;
              } else {
                  return false;
              }
          }));
  }

  logout() {
      const url: string = ApiEndpointConfig.getPath('logout');
      const token = localStorage.getItem('tokenKey');
      let httpHeaders: HttpHeaders;
      if (token) {
          httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
      }
      const body = {};
      const httpOptions = {
          headers: httpHeaders
      };

      this.common_logout();
      return this.httpClient.post(url, body, httpOptions )
          .subscribe(response => {
              // Add token-dependant logout functionality here (optional).
              },
          err => {
              console.log(err);
              });

  }
  common_logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tokenKey');
    localStorage.removeItem('izendatoken');
    // Notify is not authenticated
    this.isAdminSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  register(tenantname: string, username: string, password: string, confirmpassword: string) {
      const url: string = ApiEndpointConfig.getPath('register');
      const httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
      const body: string = JSON.stringify({Tenant: tenantname,  Email: username, Password: password, ConfirmPassword: confirmpassword });
      const httpOptions = {
          headers: httpHeaders
      };


      return this.httpClient.post(url, body, httpOptions )
          .pipe(map((response) => {
              if (response['status'] >= 200 && response['status'] < 300 ) {
                  return true;
              } else {
                    return false;
              }
          }));
  }

  getIzendaToken(token: string): void {
      const url: string = ApiEndpointConfig.getPath('getizendatoken');
      const httpHeaders: HttpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
      const httpOptions = {
          headers: httpHeaders
      };

      this.httpClient.get(url, httpOptions)
      .subscribe(
          data => {
              const tokenValue = data as string;
              console.log('Izenda token: ' + tokenValue);
              localStorage.setItem('izendatoken', tokenValue);
          },
          error => {
              console.log('Cannot get Izenda Token');
              console.log(error);
          });
  }

  hasToken(): boolean {
      return !!localStorage.getItem('tokenKey');
  }
  checkIsAdmin(): boolean {
    let ret: boolean = false;
    let user: string = localStorage.getItem('currentUser');
    if (user)
      ret = this.hasToken && (localStorage.getItem('currentUser').toLowerCase() === "izendaadmin@system.com");

    return ret;
  }

  isAdmin(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }
  currentUser(): Observable<string> {
      return this.currentUserSubject.asObservable();
  }
  isAuthenticated(): Observable<boolean> {
      return this.isAuthenticatedSubject.asObservable();
  }

  AppSvcPost(route: string, jsonData: any) {
    if (route === null || route.trim().length === 0)
      return;

    let token = localStorage.getItem('tokenKey');
    const httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' , 'Authorization': 'Bearer ' + token });
    const httpOptions = {
      headers: httpHeaders
    };
    let url: string = route;
    if (!url.toLowerCase().startsWith('http:'))
      url = this.endPoint + (url.startsWith("/") ? "" : "/") + url;
    return this.httpClient.post(url, jsonData, httpOptions)
      .pipe(map(res => (res)));
  }
  private get endPoint() {
    return ApiEndpointConfig.getPath('authAPI');
  }
}
