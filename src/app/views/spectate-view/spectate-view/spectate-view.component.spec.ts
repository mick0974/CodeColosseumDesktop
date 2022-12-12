import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectateViewComponent } from './spectate-view.component';

describe('SpectateViewComponent', () => {
  let component: SpectateViewComponent;
  let fixture: ComponentFixture<SpectateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpectateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpectateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
