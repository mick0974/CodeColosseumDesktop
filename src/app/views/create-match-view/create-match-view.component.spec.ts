import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatchViewComponent } from './create-match-view.component';

describe('CreateMatchViewComponent', () => {
  let component: CreateMatchViewComponent;
  let fixture: ComponentFixture<CreateMatchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMatchViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMatchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
