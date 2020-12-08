import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import '../../assets/izenda/izenda_common';
import '../../assets/izenda/izenda_locales';
import '../../assets/izenda/izenda_vendors';
declare var require: any;
const IzendaSynergy = require('../../assets/izenda/izenda_ui');
import { ApiEndpointConfig } from '../ApiEndpointConfig';

@Injectable()
export class IzendaIntegrate {

  constructor(private router: Router) {
  }

  DoIzendaConfig(): void {
    IzendaSynergy.config({
      WebApiUrl: ApiEndpointConfig.getPath('izendaAPI'),
      BaseUrl: '/',
      RootPath: '/assets/izenda',
      CssFile: 'izenda-ui.css',
      Routes: {
        ReportDesigner: 'reportdesigner',
        Report: 'report',
        ReportViewer: 'reportviewer',
        ReportViewerPopup: 'reportviewerpopup',
        Viewer: 'viewer',
        Dashboard: 'dashboard',
        New: 'new',
        Settings: 'settings',
        Account: 'account',
        MyProfile: 'myprofile',
      },
      Timeout: 3600,
      NeedToEncodeUrl: false,
      OnReceiveUnauthorizedResponse: this.redirectToLoginPage,
    });
  }

  redirectToLoginPage() {
    console.log('Current user is unauthorized to access Izenda function. Navaigate to login page');
    this.router.navigate(['/login']);
  }

  setContext(): void {
    const currentUserContext = {
      token: localStorage.getItem('izendatoken')
    };
    IzendaSynergy.setCurrentUserContext(currentUserContext);
  }

  /* Izenda Function */

  RenderIzenda() {
    this.setContext();
    const dom = document.getElementById('izenda-root');
    IzendaSynergy.render(dom);
    return dom;
  }

  RenderIzendaSettings() {
    this.setContext();
    const dom = document.getElementById('izenda-root');
    IzendaSynergy.renderSettingPage(dom);
    return dom;
  }

  RenderReportList() {
    this.setContext();
    const dom = document.getElementById('izenda-root');
    IzendaSynergy.renderReportPage(dom);
    return dom;
  }

  RenderReportDesigner(): any {
    this.setContext();
    const dom = document.getElementById('izenda-root');
    IzendaSynergy.renderReportDesignerPage(dom);
    return dom;
  }

  RenderReportViewer(reportId = null, filters = null) {
    this.setContext();
    const dom = document.getElementById('izenda-root');
    IzendaSynergy.renderReportViewerPage(dom, reportId || '[your report id]', filters);
    return dom;
  }

  RenderReportCustomizedFilterViewer() {
    this.setContext();
    const filtersObj: any = {
      filters: [],
      overridingFilterValue:
      {
        // filter object to pass to api
        // override filter value at position 1 which is applying on current report, change >30 to >50
        p1value: 50,
        // override filter value at position 2 which is applying on current report
        // change beetween (20:50) to (30:40)
        p2value: '30;#40'
      }
    };

    const dom = document.getElementById('izenda-root');
    IzendaSynergy.renderReportViewerPage(dom, '[your report id]', filtersObj);
    return dom;
  }

  RenderReportParts() {
    // debugger;
    this.setContext();
    IzendaSynergy.renderReportPart(document.getElementById('izenda-report-part1'), {
      id: 'fb9703eb-3fc2-4fd5-b95b-9509b08e5990' // your 1st report part id]
    });

    IzendaSynergy.renderReportPart(document.getElementById('izenda-report-part2'), {
      id: '7d763799-062f-42db-a2a7-02370010147c', // your 2nd report part id]
    });

    IzendaSynergy.renderReportPart(document.getElementById('izenda-report-part3'), {
      id: '8bd60556-dbfc-41e3-b87b-205b4851fe84' // your 3rd report part id]
    });

  }

  UpdateResultReportPart(reportPartId: string, overridingFilterValue: any, containerId: string) {
    this.setContext();
    IzendaSynergy.renderReportPart(document.getElementById(containerId), {
      id: reportPartId,
      overridingFilterValue,
    });
  }

  RenderSingleReportPart(reportPartId: string, containerId: string) {
    this.setContext();
    IzendaSynergy.renderReportPart(document.getElementById(containerId), {
      id: reportPartId
    });
  }

  RenderDashboard() {
    this.setContext();
    const dom = document.getElementById('izenda-root');
    IzendaSynergy.renderDashboardPage(dom);
    return dom;
  }

  RenderDashboardDesigner() {
    this.setContext();
    const dom = document.getElementById('izenda-root');
    IzendaSynergy.renderNewDashboardPage(dom);
    return dom;
  }

  RenderDashboardViewer() {
    this.setContext();
    const dom = document.getElementById('izenda-root');
    IzendaSynergy.renderDashboardViewerPage(dom, '[your dashboard id]');
    return dom;
  }

  RenderExportManager() {
    const token = localStorage.getItem("izendatoken");
    IzendaSynergy.setCurrentUserContext({ token: token });
    let dom = document.getElementById('izenda-root');
    IzendaSynergy.renderExportManagerPage(dom);
    return dom;
  }

  DestroyDom(dom: any) {
    this.setContext();
    IzendaSynergy.unmountComponent(dom);
  }

  /* Izenda Helper Function */

  AutoHideIzenaProgressBar() {
    this.HideIzenaProgressBar('izenda-root', 'progressLoader');
  }

  HideIzenaProgressBar(targetId: string, progressBarId: string) {
    // select the target node
    const target = document.getElementById(targetId);

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const progressBar = document.getElementById(progressBarId);
        if (progressBar) {
          progressBar.style.display = 'none';
        }
      });
    });

    // configuration of the observer:
    const config = { attributes: true, childList: true, characterData: true };
    if (target) {
      // pass in the target node, as well as the observer options
      observer.observe(target, config);
    }
  }
}

