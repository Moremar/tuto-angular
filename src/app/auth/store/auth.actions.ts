import { Action } from '@ngrx/store';

import { User } from '../user.model';


export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGIN';

export class LoginAction implements Action {
  readonly type = USER_LOGIN;
  constructor(public user: User) {}
}

export class LogoutAction implements Action {
  readonly type = USER_LOGOUT;
  constructor() {}
}
