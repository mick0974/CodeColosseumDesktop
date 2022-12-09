import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameViewComponent } from './create-game-view.component';

describe('CreateGameViewComponent', () => {
  let component: CreateGameViewComponent;
  let fixture: ComponentFixture<CreateGameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGameViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
