import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-createtenant',
  templateUrl: './createtenant.component.html',
  styleUrls: ['./createtenant.component.css']
})

export class CreateTenantComponent implements OnInit {
    model: any = {};
    error = '';
    loading = false;

    currentUser: Observable<string>;
    isAuthenticated: Observable<boolean>;
  
    constructor(private router: Router, private authService: AuthenticationService) {
         this.currentUser = authService.currentUser();
         this.isAuthenticated = authService.isAuthenticated();
    }

    ngOnInit() {
        
    }
  }
