import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AlertComponent } from '../shared/alert/alert.component';

/**
 * Component showing a login / signup form
 * If an error occurs while trying to login, we have 2 possibilities to display it :
 *  - in a div in this component
 *  - in a modal from a different component
 */

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  // JS object representing the form provided by Angular
  @ViewChild('authForm', {static: false}) authForm: NgForm;

  // template where we can display our modal when an error occurs
  @ViewChild(PlaceholderDirective, {static: false}) errorModalTemplate: PlaceholderDirective;

  // to know if we should display a spinner
  isLoading = false;

  // if not null, display an error message in the UI
  errorMessage: string = null;

  // subscription on the "close" event submitter of the dynamically created error modal
  private modalCloseSub: Subscription = null;


  constructor(
        private authService: AuthService,
        private router: Router,
        private factoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.modalCloseSub) {
      this.modalCloseSub.unsubscribe();
    }
  }

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

        // if we want to use the error <div> inside the HTML
        // this.errorMessage = errorMess;

        // alternatively if we want to dynamically create an error modal
        this.showAlertModal(errorMess);
        this.isLoading = false;
      }
    );
  }

  onCloseAlert() {
    this.errorMessage = null;
  }

  showAlertModal(message: string) {
    const factory = this.factoryResolver.resolveComponentFactory(AlertComponent);
    const viewContainerRef = this.errorModalTemplate.viewContainerRef;

    // if anything else here before, clear it
    viewContainerRef.clear();

    // create alert component
    const modalRef = viewContainerRef.createComponent(factory);

    // link input and output
    modalRef.instance.message = message;
    this.modalCloseSub = modalRef.instance.closeAlert.subscribe(
      () => {
        this.modalCloseSub.unsubscribe();
        viewContainerRef.clear();
      }
    );
  }
}
