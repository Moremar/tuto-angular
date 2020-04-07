import { ShoppingListState } from './shopping-list/store/shopping-list.reducer';
import { AuthState } from './auth/store/auth.reducer';
import { RecipesState } from './recipes/store/recipes.reducer';

/**
 * Representation of the state of the app maintained by Redux
 * Each section of the state is defined in the corresponding
 * section of the code
 */
export interface AppState {
  recipes: RecipesState;
  shoppingList: ShoppingListState;
  auth: AuthState;
}
