import { AddIngredientAction, DeleteIngredientAction } from './shopping-list.actions';
import { ADD_INGREDIENT, DELETE_INGREDIENT, CLEAR_INGREDIENTS } from './shopping-list.actions';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Action } from '@ngrx/store';

/**
 * Reducer for NgRx
 *
 * We can define an initial state that will be used at NgRx initialization.
 * We must define the reducer function that takes the previous state and the
 * action to trigger.
 * The reducer will only perform an action if it is an action it cares about.
 */

// define an initial state
const initialState = {
  ingredients: [
    new Ingredient('Potato', 2),
    new Ingredient('Tomato', 3),
  ]
};

// reducer function
// the default value of state is used at state initialization
export function ShoppingListReducer(
      state = initialState,
      action: Action) {
  console.log(action);
  switch (action.type) {

    case ADD_INGREDIENT: {
      const addAction = action as AddIngredientAction;
      const ingredients = [];
      const newIng = addAction.payload;

      if (newIng.name === '' || newIng.amount === 0) {
        // invalid input, ignore it
        break;
      }

      // if the ingredient already exists, increase its amount, else create it
      let existing = false;
      for (const ing of state.ingredients) {
        let amount = ing.amount;
        if (ing.name === newIng.name) {
          existing = true;
          amount += newIng.amount;
        }
        ingredients.push(new Ingredient(ing.name, amount));
      }
      if (!existing) {
        ingredients.push(newIng.clone());
      }

      return {
        // copy all properties of state into the new object
        ...state,
        // overwrite the properties we want to change
        ingredients: ingredients
      };
    }

    case DELETE_INGREDIENT: {
      const deleteAction = action as DeleteIngredientAction;
      const ingredients = state.ingredients.filter(ing => ing.name !== deleteAction.ingredientName);
      return {
        // copy all properties of state into the new object
        ...state,
        // overwrite the properties we want to change
        ingredients: ingredients
      };
    }

    case CLEAR_INGREDIENTS: {
      return {
        // copy all properties of state into the new object
        ...state,
        // clear the ingredients array
        ingredients: []
      };
    }

    default:
      return state;
  }
}
