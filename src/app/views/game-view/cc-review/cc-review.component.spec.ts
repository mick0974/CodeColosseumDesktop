import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcReviewComponent } from './cc-review.component';

describe('CcReviewComponent', () => {
  let component: CcReviewComponent;
  let fixture: ComponentFixture<CcReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
