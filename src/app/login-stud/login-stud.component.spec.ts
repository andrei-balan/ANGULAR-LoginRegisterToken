import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStudComponent } from './login-stud.component';

describe('LoginStudComponent', () => {
  let component: LoginStudComponent;
  let fixture: ComponentFixture<LoginStudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginStudComponent]
    });
    fixture = TestBed.createComponent(LoginStudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
