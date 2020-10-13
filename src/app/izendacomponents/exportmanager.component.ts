import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { IzendaIntegrate } from '../_helpers/izendaintegrate';

@Component({
  templateUrl: 'rootcontainer.html'
})

export class ExportManagerComponent implements AfterViewInit, OnDestroy {
  dom: any = {};
  constructor(private izIntegrate: IzendaIntegrate) { }

  ngAfterViewInit() {
    this.dom = this.izIntegrate.RenderExportManager();
  }
  ngOnDestroy() {
    this.izIntegrate.DestroyDom(this.dom);
  }
}
