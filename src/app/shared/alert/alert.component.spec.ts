import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // for test of function calls, just use the component (JS object)
  it('should emit a closeAlert event on close()', () => {
    // subscribe to the closeAlert event
    let triggered = false;
    component.closeAlert.subscribe(() => triggered = true);
    // call the close() function
    component.onClose();
    // ensure the event was triggered
    expect(triggered).toBe(true);
  });

  // for test of DOM content, use the native element (DOM object)
  it('should contain message in the DOM', () => {
    // set the value of the message property
    component.message = 'Error 505';
    // refresh the DOM
    fixture.detectChanges();
    // ensure the DOM now has that message
    expect(fixture.nativeElement.textContent).toContain('Error 505');
  });
});
