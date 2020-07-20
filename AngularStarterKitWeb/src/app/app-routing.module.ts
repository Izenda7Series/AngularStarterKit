import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/auth.guard';
import { ExportComponent } from './export/export.component';
import { ExportdashboardviewerComponent } from './export/exportdashboardviewer/exportdashboardviewer.component';
import { ExportreportviewerComponent } from './export/exportreportviewer/exportreportviewer.component';
import { DashboardComponent, DashboardDesignerComponent, IzendaHomeComponent, IzendaSettingComponent, ReportCustomFilterComponent,
    ReportDesignerComponent, ReportListComponent, ReportPartComponent,
    AdvancedReportPartComponent, ReportViewerComponent, DashboardViewerComponent } from './izendacomponents/index';
import { CreateTenantComponent } from './createtenant/createtenant.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'izenda', component: IzendaHomeComponent, canActivate: [AuthGuard]},
  { path: 'izenda/settings', component: IzendaSettingComponent, canActivate: [AuthGuard]},
  { path: 'izenda/reportdesigner', component: ReportDesignerComponent, canActivate: [AuthGuard]},
  { path: 'izenda/report', component: ReportListComponent, canActivate: [AuthGuard]},
  { path: 'izenda/reportviewer', component: ReportViewerComponent, canActivate: [AuthGuard]},
  { path: 'izenda/reportcustomfilter', component: ReportCustomFilterComponent, canActivate: [AuthGuard]},
  { path: 'izenda/reportpart', component: ReportPartComponent, canActivate: [AuthGuard]},
  { path: 'izenda/advancedreportpart', component: AdvancedReportPartComponent},
  { path: 'izenda/dashboarddesigner', component: DashboardDesignerComponent, canActivate: [AuthGuard]},
  { path: 'izenda/dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'izenda/dashboardviewer', component: DashboardViewerComponent, canActivate: [AuthGuard]},
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },

  // create user / tenant
  { path: 'createtenant', component: CreateTenantComponent, canActivate: [AuthGuard]},

  // export route
   { path: 'viewer/reportpart/:id', component: ExportComponent},
   { path: 'report/view/:id', component: ExportreportviewerComponent},
   { path: 'dashboard/edit/:id', component: ExportdashboardviewerComponent},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
