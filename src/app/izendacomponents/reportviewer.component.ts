import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import {IzendaIntegrate} from '../_helpers/izendaintegrate';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    templateUrl: 'rootcontainer.html'
})

export class ReportViewerComponent implements AfterViewInit, OnDestroy {
    dom: any = {};
    reportId: string;

    constructor(private izItergrate: IzendaIntegrate, private actRoute: ActivatedRoute) {}

    ngAfterViewInit() {
        this.actRoute.params.subscribe((params: Params) => {
          this.reportId = params.id;
        });
        let filters = null;
        this.actRoute.queryParams.subscribe((params: Params) => {
          const overridingFilterValue = {};
          Object.keys(params).forEach(function (key) {
            overridingFilterValue[key] = decodeURIComponent(params[key]);
          });
          filters = { overridingFilterValue: overridingFilterValue };
        });
        this.dom = this.izItergrate.RenderReportViewer(this.reportId, filters);
        this.izItergrate.AutoHideIzenaProgressBar();
    }

    ngOnDestroy() {
        this.izItergrate.DestroyDom(this.dom);
    }
}
