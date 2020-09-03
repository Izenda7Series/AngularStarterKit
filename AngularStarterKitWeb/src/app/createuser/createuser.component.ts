import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { IzendaApiService } from '../_services/izendaapi.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})

export class CreateUserComponent implements OnInit {
    model: any = {};
    error = '';
    success = '';
    isloading = false;
    public tenants: any[];
    roles: any[];

    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"; 

    isAuthenticated: Observable<boolean>;
    canUpdateTenantAndUser: Observable<boolean>;

    constructor(private router: Router, private authService: AuthenticationService, private _ias: IzendaApiService) {
    }

    ngOnInit() {
      this.loadLists();
      this.model.tenant = null;
      this.model.userid = '';
      this.model.isadmin = false;
      this.model.firstname = '';
      this.model.lastname = '';
      this.model.selectedrole = null;
      this.canUpdateTenantAndUser = this.authService.canUpdateTenantAndUser();
      this.isAuthenticated = this.authService.isAuthenticated();
    }

    createUser() {
      if (!this.isAuthenticated || !this.canUpdateTenantAndUser){
        this.router.navigate(['/login']);
      }

      this.isloading = true;

      let data: string = JSON.stringify({
        Tenant: this.model.tenant == null ? '' : this.model.tenant.name,
        UserID: this.model.userid, IsAdmin: this.model.isadmin,
        FirstName: this.model.firstname, LastName: this.model.lastname,
        SelectedRole: this.model.selectedrole == null ? '' : this.model.selectedrole.name });
      this.authService.AppSvcPost('createuser', data).subscribe(result => {
          if (result === 'success') {
            this.success = 'User has been created successfully';
            this.error = '';
          } else {
            this.error = 'Failed to create a user, Try again';
            this.success = '';
          }
          this.isloading = false;
        },
          error => {
            this.error = 'Failed to create a user, Try again';
            this.success = '';

            this.isloading = false;
          });
    }
    private loadLists() {
      this.loadTenants();
      this.loadRoles();
    }
    private loadTenants() {
        this._ias.APIGet("tenant/allTenants").subscribe(result => {
        if (result != null) {
            this.tenants = result as any[];
            this.model.selectedrole = null;
            this.success = '';
            this.error = '';
          } else {
            this.error = 'Failed to retrieve tenants or roles. Please try again';
            this.success = '';
          }
          this.isloading = false;
        },
          error => {
            this.error = 'Failed to retrieve tenants or roles. Please try again';
            this.success = '';

            this.isloading = false;
          });
    }
    private loadRoles() {
      this._ias.APIGet('role/all' + (this.model.tenant == null ? '' : '/' + this.model.tenant.id)).subscribe(result => {
            if (result != null) {
              this.roles = (result as any[]).filter(f => f.active);
              this.success = '';
              this.error = '';
            } else {
            this.error = 'Failed to retrieve tenants or roles. Please try again';
              this.success = '';
            }
            this.isloading = false;
          },
          error => {
            this.error = 'Failed to retrieve tenants or roles. Please try again';
            this.success = '';

            this.isloading = false;
          });
    }
    public tenantChanged(tenant:any) {
      console.log("tenant:" + (this.model.tenant == null?'null':this.model.tenant.name));
        this.loadRoles();
    }
  }
