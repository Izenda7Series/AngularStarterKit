import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { ApiEndpointConfig } from '../ApiEndpointConfig';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  public token: string;
  public currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('currentUser'));
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private httpClient: HttpClient, private router: Router) {
      // set token if saved in local storage
      this.token =  localStorage.getItem('tokenKey');
  }

  login(tenantname: string, username: string, password: string): Observable<boolean> {
      const url: string = ApiEndpointConfig.getPath('login');

      const authHttpParams  = new HttpParams()
          .set('grant_type', 'password')
          .set('username', username)
          .set('password', password);

      if (tenantname) {
          authHttpParams.set('tenant', tenantname);
      }
      const body = authHttpParams.toString();

      const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      };

      return this.httpClient.post(url, body, httpOptions)
          .map((response) => {
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
                  return true;
              } else {
                  return false;
              }
          });
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

      return this.httpClient.post(url, body, httpOptions )
          .subscribe(response => {
                  localStorage.removeItem('currentUser');
                  localStorage.removeItem('tokenKey');
                  localStorage.removeItem('izendatoken');

                  // Notify is not authenticated
                  this.isAuthenticatedSubject.next(false);
                  this.currentUserSubject.next(null);
              },
          err => {
              console.log(err);
              });

  }

  register(tenantname: string, username: string, password: string, confirmpassword: string) {
      const url: string = ApiEndpointConfig.getPath('register');
      const httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
      const body: string = JSON.stringify({Tenant: tenantname,  Email: username, Password: password, ConfirmPassword: confirmpassword });
      const httpOptions = {
          headers: httpHeaders
      };


      return this.httpClient.post(url, body, httpOptions )
          .map((response) => {
              if (response['status'] >= 200 && response['status'] < 300 ) {
                  return true;
              } else {
                    return false;
              }
          });
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

  currentUser(): Observable<string> {
      return this.currentUserSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
      return this.isAuthenticatedSubject.asObservable();
  }
}
