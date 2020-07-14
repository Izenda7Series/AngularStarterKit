import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

import { AuthenticationService } from './authentication.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  // TODO : If needed will need to update this userservice to use the user model
  getUsers(): any {
    // add authorization header with jwt token
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.authenticationService.token });

    // get users from api
    return this.http.get('/api/users', {headers: headers})
      .map((response: Response) => response.json());
  }
}