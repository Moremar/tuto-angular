import { Action } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';


/**
 * This files gathers all Redux actions that can be performed
 * on the shopping list
 */

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const CLEAR_INGREDIENTS = 'CLEAR_INGREDIENTS';
export const SELECT_INGREDIENT = 'SELECT_INGREDIENT';

export class AddIngredientAction implements Action {
  // mandatory type for every action
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class DeleteIngredientAction implements Action {
  // mandatory type for every action
  readonly type = DELETE_INGREDIENT;
  constructor(public ingredientName: string) {}
}

export class ClearIngredientsAction implements Action {
  // mandatory type for every action
  readonly type = CLEAR_INGREDIENTS;
  constructor() {}
}

export class SelectIngredientAction implements Action {
  // mandatory type for every action
  readonly type = SELECT_INGREDIENT;
  constructor(public payload: Ingredient) {}
}
