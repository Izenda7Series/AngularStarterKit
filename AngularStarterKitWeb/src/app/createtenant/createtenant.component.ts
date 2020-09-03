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
    success = '';
    loading = false;

    isAuthenticated: Observable<boolean>;
    canUpdateTenantAndUser: Observable<boolean>;
  
    constructor(private router: Router, private authService: AuthenticationService) {
         this.isAuthenticated = authService.isAuthenticated();
         this.canUpdateTenantAndUser = authService.canUpdateTenantAndUser();
    }

    ngOnInit() {
      
    }

    createTenant() {
      if (!this.isAuthenticated || !this.canUpdateTenantAndUser){
        this.router.navigate(['/login']);
      }

      this.loading = true;

      const body: string = JSON.stringify({ TenantId: this.model.tenantid, TenantName: this.model.tenantname });
      this.authService.AppSvcPost('createtenant', body).subscribe(result => {
        if (result === 'success'){
          this.success = 'Tenant has been created successfully';
          this.error = '';
        }else{
          this.error = 'Failed to create a tenant, Try again';
          this.success = '';
        }
        this.loading = false;
      },
      error =>{
        this.error = 'Failed to create a tenant, Try again';
        this.success = '';
        
        this.loading = false;
      });
    }
  }

