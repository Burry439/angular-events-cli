import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCreatedEventsComponent } from './users-created-events.component';

describe('UsersCreatedEventsComponent', () => {
  let component: UsersCreatedEventsComponent;
  let fixture: ComponentFixture<UsersCreatedEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersCreatedEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCreatedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
