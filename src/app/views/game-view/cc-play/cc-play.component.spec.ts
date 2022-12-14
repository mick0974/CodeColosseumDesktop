import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcPlayComponent } from './cc-play.component';

describe('CcPlayComponent', () => {
  let component: CcPlayComponent;
  let fixture: ComponentFixture<CcPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcPlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
