import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IzendaIntegrate } from '../_helpers/izendaintegrate';

@Component({
  selector: 'app-reportviewers',
  templateUrl: './reportviewers.component.html',
  styleUrls: ['./reportviewers.component.css']
})
export class ReportviewersComponent implements AfterViewInit {

  constructor(private izIntegrate: IzendaIntegrate) { }

  ngAfterViewInit() {
    const reportIds = ['3d11c11c-e1f7-4463-b130-d9c45b72e1a6', '5c43cf5f-a9d8-447d-bd3f-172e382cc40f'];
    const domIds = ['report1', 'report2'];
    const dom1 = this.izIntegrate.RenderReportViewers(reportIds[0], domIds[0]);
    let dom2;
    setTimeout(() => { dom2 = this.izIntegrate.RenderReportViewers(reportIds[1], domIds[1]); }, 100);
    console.log(dom1);
    console.log(dom2);
  }

}
