import { Action } from '@ngrx/store';

import { User } from '../user.model';

// actions for reducers
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

// actions for side-effects
export const AUTH_EFFECT_AUTO_LOGIN = 'AUTH_EFFECT_AUTO_LOGIN';
export const AUTH_EFFECT_SAVE_USER = 'AUTH_EFFECT_SAVE_USER';
export const AUTH_NO_ACTION = 'AUTH_NO_ACTION';


export class LoginAction implements Action {
  readonly type = AUTH_LOGIN;
  constructor(public user: User) {}
}

export class LogoutAction implements Action {
  readonly type = AUTH_LOGOUT;
  constructor() {}
}

export class EffectAutoLoginAction implements Action {
  readonly type = AUTH_EFFECT_AUTO_LOGIN;
  constructor() {}
}

export class EffectSaveUserAction implements Action {
  readonly type = AUTH_EFFECT_SAVE_USER;
  constructor(public user: User) {}
}

// never called in any reducer, just to trigger an action when
// nothing needs to be done from the effects
export class NoAction implements Action {
  readonly type = AUTH_NO_ACTION;
  constructor() {}
}
