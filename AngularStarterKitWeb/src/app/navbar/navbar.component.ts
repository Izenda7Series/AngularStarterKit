import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser: Observable<string>;
  isAuthenticated: Observable<boolean>;
  public isAuthAsAdmin: Observable<boolean>;

  constructor(private router: Router, private authService: AuthenticationService) {
    this.currentUser = this.authService.currentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAuthAsAdmin = this.authService.isAdmin();
  }

  logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
  }
}
