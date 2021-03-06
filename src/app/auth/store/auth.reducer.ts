import { Action } from '@ngrx/store';

import { AUTH_LOGIN, AUTH_LOGOUT, LoginAction } from './auth.actions';
import { User } from '../user.model';


export interface AuthState {
  user: User;
}

const initialState: AuthState = {
  user: null
};

/**
 * Reducer for the Auth related Redux actions
 */
export function AuthReducer(
    state: AuthState = initialState,
    action: Action) {
  console.log(action);
  switch (action.type) {

    case AUTH_LOGIN: {
      const loginAction = action as LoginAction;
      return {
        ...state,
        // set the logged user
        user: loginAction.user
      };
    }

    case AUTH_LOGOUT: {
      return {
        ...state,
        // reset the logged user
        user: null
      };
    }

    default:
      return state;
  }
}
