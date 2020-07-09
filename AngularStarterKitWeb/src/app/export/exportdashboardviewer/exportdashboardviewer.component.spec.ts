import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportdashboardviewerComponent } from './exportdashboardviewer.component';

describe('ExportdashboardviewerComponent', () => {
  let component: ExportdashboardviewerComponent;
  let fixture: ComponentFixture<ExportdashboardviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportdashboardviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportdashboardviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
