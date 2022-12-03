import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcResultsComponent } from './cc-results.component';

describe('CcResultsComponent', () => {
  let component: CcResultsComponent;
  let fixture: ComponentFixture<CcResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
