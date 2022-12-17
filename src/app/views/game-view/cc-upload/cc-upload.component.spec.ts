import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcUploadComponent } from './cc-upload.component';

describe('CcUploadComponent', () => {
  let component: CcUploadComponent;
  let fixture: ComponentFixture<CcUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
