import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportreportviewerComponent } from './exportreportviewer.component';

describe('ExportreportviewerComponent', () => {
  let component: ExportreportviewerComponent;
  let fixture: ComponentFixture<ExportreportviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportreportviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportreportviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
