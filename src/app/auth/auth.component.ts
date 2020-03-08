import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  // JS object representing the form provided by Angular
  @ViewChild('authForm', {static: false}) authForm : NgForm;

  // to know if we should display a spinner
  isLoading = false;

  // if not null, display an error message in the UI
  errorMessage: string = null;


  constructor(
        private authService: AuthService,
        private router: Router)
  {}

  ngOnInit() {}

  onSignUp() {
    this.isLoading = true;
    this.errorMessage = null;
    const authObservable = this.authService.signup(
      this.authForm.value.email, 
      this.authForm.value.password);
    this.subscribeAuthObservable(authObservable);
    this.authForm.reset();
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = null;
    const authObservable = this.authService.login(
      this.authForm.value.email, 
      this.authForm.value.password);
    this.subscribeAuthObservable(authObservable);
    this.authForm.reset();
  }
  
  // common auth handler for login of signup
  private subscribeAuthObservable(authObservable) {
    authObservable.subscribe(
      authResponse => {
        console.log('Received auth response : ');
        console.log(authResponse);
        this.isLoading = false;
        this.router.navigate(['/recipes'] );
      },
      // here we receive an error message created by the catchError pipe operator 
      // in the auth service
      errorMess => {
        console.log('Received auth error : ');
        console.log(errorMess);
        this.errorMessage = errorMess;
        this.isLoading = false;
      }
    );
  }

  onCloseAlert() {
    this.errorMessage = null;
  }
}
