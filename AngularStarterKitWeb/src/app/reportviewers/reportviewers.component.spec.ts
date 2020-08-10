import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportviewersComponent } from './reportviewers.component';

describe('ReportviewersComponent', () => {
  let component: ReportviewersComponent;
  let fixture: ComponentFixture<ReportviewersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportviewersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportviewersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
