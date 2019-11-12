import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameButtonsComponent } from './frame-buttons.component';

describe('FrameButtonsComponent', () => {
  let component: FrameButtonsComponent;
  let fixture: ComponentFixture<FrameButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
