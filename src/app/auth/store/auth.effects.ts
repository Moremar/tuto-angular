import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import { AUTH_EFFECT_AUTO_LOGIN, AUTH_LOGOUT, AUTH_EFFECT_SAVE_USER } from './auth.actions';
import { EffectAutoLoginAction, LoginAction, NoAction, LogoutAction, EffectSaveUserAction } from './auth.actions';
import { AuthService } from '../auth.service';
import { User } from '../user.model';


/**
 * All side effects that can be triggered by NgRx.
 * We use side effects to manage the user in local storage, since it is also state management
 * We could also handle the HTTP requests to Firebase to get the user from side-effects.
 *
 * Side effects can either return a Redux action that will get triggered,
 * or not return anything (need to specify it in the @Effect() decorator)
 */

@Injectable()
export class AuthEffects {

  constructor(
        private actions$: Actions,
        private authService: AuthService) {}

  /**
   * Check if we already have a user in the local storage
   * If we do, use it to login, else do nothing
   */
  @Effect()
  autologin = this.actions$.pipe(
    ofType(AUTH_EFFECT_AUTO_LOGIN),
    map( (autoLoginAction: EffectAutoLoginAction) => {
      // read the current authenticated user in the local storage
      // all fields are strings when retrieved from JSON, we need to convert the Date ourselves !
      const localUser = JSON.parse(localStorage.getItem('user'));
      console.log('Got from local storage = ');
      console.log(localUser);
      if (localUser) {
        const expirationDate = new Date(localUser._tokenExpirationDate);
        const user = new User(localUser.email, localUser.userId, localUser._token, expirationDate);
        // schedule the automatic logout at token expiration
        const expireIn = expirationDate.getTime() - new Date().getTime();
        if (expireIn > 0) {
          console.log('Auto-login successful');
          this.authService.scheduleLogout(expireIn);
          // save the authenticated user in our state
          return new LoginAction(user);
          }
      }
      // if we do not have a valid user in local storage, do nothing (auto-login not possible)
      console.log('Cannot auto-login');
      return new NoAction();
    })
  );


  /**
   * Remove the user from local storage on logout
   * Never dispatch another action, so we need to specify it in the decorator
   */
  @Effect({dispatch: false})
  logout = this.actions$.pipe(
    ofType(AUTH_LOGOUT),
    tap( (logoutAction: LogoutAction) => {
      localStorage.removeItem('user');
    })
  );


  /**
   * Save a user in local storage
   * Never dispatch another action, so we need to specify it in the decorator
   */
  @Effect({dispatch: false})
  saveUser = this.actions$.pipe(
    ofType(AUTH_EFFECT_SAVE_USER),
    tap( (saveUserAction: EffectSaveUserAction) => {
      const user = saveUserAction.user;
      localStorage.setItem('user', JSON.stringify(user));
    })
  );
}
