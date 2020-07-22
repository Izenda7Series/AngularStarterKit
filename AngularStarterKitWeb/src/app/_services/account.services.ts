import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { ApiEndpointConfig } from '../ApiEndpointConfig';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

    constructor(private httpClient: HttpClient, private router: Router) {
        
    }

    createTenant(tenantid: string, tenantname: string){
      const url: string = ApiEndpointConfig.getPath('createtenant');
      const httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
      const body: string = JSON.stringify({TenantId: tenantid,  TenantName: tenantname });
      const httpOptions = {
          headers: httpHeaders
      };

      return this.httpClient.post(url, body, httpOptions )
          .map((response) => {
            if (response === 'success')
              return true;
            else
              return false;
          });
    }
}
