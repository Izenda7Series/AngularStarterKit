import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import '../../assets/izenda/izenda_common';
import '../../assets/izenda/izenda_locales';
import '../../assets/izenda/izenda_vendors';
declare var require: any;
const IzendaSynergy = require('../../assets/izenda/izenda_ui');

@Component({
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements AfterViewInit {
  currentUserContext: any = {};
  reportPartId: string;
  token: string;
  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngAfterViewInit() {
    console.log(this.activatedRoute);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.reportPartId = params['id'];
    });
    IzendaSynergy.renderReportPart(document.getElementById('izenda-export-reportpart'), {
      "id": this.reportPartId,
      "useQueryParam": true,
    });
    console.log("Izenda Process | Exporting report id: " + this.reportPartId);
  }
}
