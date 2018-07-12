import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAttendingEventsComponent } from './users-attending-events.component';

describe('UsersAttendingEventsComponent', () => {
  let component: UsersAttendingEventsComponent;
  let fixture: ComponentFixture<UsersAttendingEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAttendingEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAttendingEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
