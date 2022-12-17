import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcChatComponent } from './cc-chat.component';

describe('CcChatComponent', () => {
  let component: CcChatComponent;
  let fixture: ComponentFixture<CcChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
