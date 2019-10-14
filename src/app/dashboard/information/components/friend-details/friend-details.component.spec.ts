import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendDetailsComponent } from './friend-details.component';

describe('FriendDetailsComponent', () => {
  let component: FriendDetailsComponent;
  let fixture: ComponentFixture<FriendDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
