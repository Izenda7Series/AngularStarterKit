import { Component, NgModule } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { User } from './_models/user';
import { IzendaIntegrate } from './_helpers/izendaintegrate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngDemoSite';
  currentUser: User;
  private previousPath = '';

  constructor(private router: Router, private izItergrate: IzendaIntegrate) {
    this.izItergrate.DoIzendaConfig();
  }

  logout() {
    this;
    this.router.navigate(['/login']);
  }



  getPageTransition(routerOutlet: RouterOutlet) {
    if (routerOutlet.isActivated) {
      let transitionName = 'section';

      const { path } = routerOutlet.activatedRoute.routeConfig;
      const isSame = this.previousPath === path;
      const isBackward = this.previousPath.startsWith(path);
      const isForward = path.startsWith(this.previousPath);

      if (isSame) {
        transitionName = 'none';
      } else if (isBackward && isForward) {
        transitionName = 'initial';
      } else if (isBackward) {
        transitionName = 'backward';
      } else if (isForward) {
        transitionName = 'forward';
      }

      this.previousPath = path;

      return transitionName;
    }
  }

}
