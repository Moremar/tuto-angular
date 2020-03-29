import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { Router } from '@angular/router';
import { AppState } from '../app.state';
import { AuthState } from './store/auth.reducer';
import { LoginAction, LogoutAction } from './store/auth.actions';

// To access environment variables
// The prod or QA is automatically selected by Angular
import { environment } from '../../environments/environment';

/*
 * This service handles all authentication operations (signup / login / logout)
 * It should use HTTP to communicate with the backend.
 * It allows the app to :
 *  - create users (signup)
 *  - get a token (login)
 *  - deactivate the token (logout)
 *
 * In this example, we use Firebase for the backend, so we use the Firebase Auth API :
 * https://firebase.google.com/docs/reference/rest/auth
 */

// type of data returned by the signup endpoint of the Firebase Auth API
interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Key identifying a project in Firebase, needs to be included in every Auth API call
  private FIREBASE_AUTH_API_KEY = environment.firebaseApiKey;

  // handle to automatically logout after the auth token expires
  private logoutHandle = null;

  // token of the currently logged user
  private token: string = null;

  constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<AppState>) {
    // get the user token when there is a change in the logged user
    this.getUserObs().subscribe(
      (user: User) => {
        this.token = user ? user.token : null;
        console.log('Setting token to : ');
        console.log(this.token);
      }
    );
  }


  getToken() {
    return this.token;
  }


  // get an observable on the logged user
  getUserObs() {
    return this.store
        .select('auth')
        .pipe(map((authState: AuthState) => authState ? authState.user : null));
  }


  // common code for signup and login, only the URL differs
  private createAuthObservable(authUrl: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(authUrl, {
      email: email,
      password: password,
      returnSecureToken: true   // required by the Firebase Auth API
    })
    // if an error is thrown, send only an error message for the GUI to display it
    .pipe(catchError(
      (errorResponse: HttpErrorResponse) => {
        let errorMess = 'Unknown authentication error.';
        if (errorResponse.error && errorResponse.error.error) {
          switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':  {
              errorMess = 'This email is already in use.';
              break;
            }
            case 'TOO_MANY_ATTEMPTS_TRY_LATER': {
              errorMess = 'Too many signup attempts were sent, try again later.';
              break;
            }
            case 'EMAIL_NOT_FOUND':  {
              errorMess = 'This email does not belong to any active user.';
              break;
            }
            case 'INVALID_PASSWORD': {
              // In a real app, do not tell if the password is incorrect, since it reveals that the email is valid (vulnerability)
              // Here we use it just to see easily different error messages in the screen
              errorMess = 'The password is invalid.';
              break;
            }
          }
        }
        return throwError(errorMess);
      }
    ),
    // set the authenticated user
    tap(
      (responseData) => {
        // "expiresIn" is a number of seconds, so buid the expiration from it
        const expirationDate = new Date(new Date().getTime() + (+responseData.expiresIn) * 1000);
        const user = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate);
        this.store.dispatch(new LoginAction(user));
        this.scheduleLogout(+responseData.expiresIn * 1000);

        // store the user to local storage so we can access it even if we reload the page
        localStorage.setItem('user', JSON.stringify(user));
      }
    ));
  }


  /*
   * Create a new user by sending the email/password to the auth HTTP API
   * https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
   *
   * The caller needs to subscribe to the returned observable for the HTTP request to be sent.
   */
  signup(email: string, password: string): Observable<AuthResponse> {
    const signupUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.FIREBASE_AUTH_API_KEY;
    return this.createAuthObservable(signupUrl, email, password);
  }


  /*
   * Login an existing user in Firebase Auth REST API
   * https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.FIREBASE_AUTH_API_KEY;
    return this.createAuthObservable(loginUrl, email, password);
  }

  autoLogin() {
    // read the current authenticated user in the local storage
    // all fields are strings when retrieved from JSON, we need to convert the Date ourselves !
    const localUser = JSON.parse(localStorage.getItem('user'));
    console.log('Got from local storage = ');
    console.log(localUser);
    if (localUser) {
      const expirationDate = new Date(localUser._tokenExpirationDate);
      const user = new User(localUser.email, localUser.userId, localUser._token, expirationDate);
      this.store.dispatch(new LoginAction(user));
      const expireIn = expirationDate.getTime() - new Date().getTime();
      this.scheduleLogout(expireIn);
    }
  }

  /**
   * Invalidate the current authenticated user
   */
  logout() {
    this.store.dispatch(new LogoutAction());
    localStorage.removeItem('user');

    // prevent the scheduled logout to happen
    clearTimeout(this.logoutHandle);
    this.logoutHandle = null;

    // re-route to login screen
    this.router.navigate(['/login']);
  }

  /**
   * once we get a token we need to schedule a logout when the token expires
   */
  scheduleLogout(millis: number) {
    console.log('token will be invalidated in ' + millis + ' ms');
    this.logoutHandle = setTimeout(
      () => {
        this.logout();
      }, millis
    );
  }
}
