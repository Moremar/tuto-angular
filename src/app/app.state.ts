import { ShoppingListState } from './shopping-list/store/shopping-list.reducer';
import { AuthState } from './auth/store/auth.reducer';

/**
 * Representation of the state of the app maintained by Redux
 * Each section of the state is defined in the corresponding
 * section of the code
 */
export interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
}
