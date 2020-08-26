/*  WebApiApplication Service.
 *  This service interacts with the custom application.
 *  (WebApi2StarterKit service )  ***************************/
/************************************************************/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiEndpointConfig } from '../ApiEndpointConfig';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class WAAppService {

  constructor(private httpClient: HttpClient, private router: Router) {

  }

  /* ORIG:
  createTenant(tenantid: string, tenantname: string) {
    const url: string = ApiEndpointConfig.getPath('createtenant');
    const httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    const body: string = JSON.stringify({ TenantId: tenantid, TenantName: tenantname });
    const httpOptions = {
      headers: httpHeaders
    };

    return this.httpClient.post(url, body, httpOptions)
      .map((response) => {
        if (response === 'success')
          return true;
        else
          return false;
      });
  }
  */
  createTenant(tenantid: string, tenantname: string) {
    const body: string = JSON.stringify({ TenantId: tenantid, TenantName: tenantname });
    return this.AppSvcPost('createtenant', body);
  }

  AppSvcPost(pathtoken: string, jsonData: any) {
    if (pathtoken === null || pathtoken.trim().length === 0)
      return;

    const url: string = ApiEndpointConfig.getPath(pathtoken);
    const httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    const httpOptions = {
      headers: httpHeaders
    };
    return this.httpClient.post(url, jsonData, httpOptions)
      .pipe(map(res => (res)));
  }
}
