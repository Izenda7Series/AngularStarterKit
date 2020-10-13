import { Component, AfterViewInit } from '@angular/core';
import { User } from '../../_models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var require: any;
const IzendaSynergy = require('../../../assets/izenda/izenda_ui');

@Component({
  selector: 'app-exportdashboardviewer',
  templateUrl: './exportdashboardviewer.component.html',
  styleUrls: ['./exportdashboardviewer.component.css']
})
export class ExportdashboardviewerComponent implements AfterViewInit {

  currentUserContext: any = {};
  repportId: string;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngAfterViewInit() {
    console.log(this.activatedRoute);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.repportId = params.id;
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const token = params.token;
      this.currentUserContext = { token };
    });

    console.log(this.repportId);
    console.log(this.currentUserContext);
    IzendaSynergy.setCurrentUserContext(this.currentUserContext);
    IzendaSynergy.renderReportViewerPage(document.getElementById('izenda-export-dashboardviewer'), {
      id: this.repportId,
      useQueryParam: true,
    });
  }

}
