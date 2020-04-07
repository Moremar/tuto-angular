import { Action } from '@ngrx/store';

import { Recipe } from '../recipe.model';


/**
 * All Redux actions for the Recipes section
 */

// Actions for reducer
export const CREATE_RECIPE = 'CREATE_RECIPE';
export const UPDATE_RECIPE = 'UPDATE_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const REPLACE_ALL_RECIPES = 'REPLACE_ALL_RECIPES';

// Actions for effects
export const EFFECT_FIREBASE_LOAD_RECIPE = 'EFFECT_FIREBASE_LOAD_RECIPE';
export const EFFECT_FIREBASE_PERSIST_DELETE_RECIPES = 'EFFECT_FIREBASE_PERSIST_DELETE_RECIPES';
export const EFFECT_FIREBASE_PERSIST_WRITE_RECIPES = 'EFFECT_FIREBASE_PERSIST_WRITE_RECIPES';


export class CreateRecipeAction implements Action {
  readonly type: string = CREATE_RECIPE;
  constructor(public recipe: Recipe) {}
}

export class UpdateRecipeAction implements Action {
  readonly type: string = UPDATE_RECIPE;
  constructor(public recipe: Recipe) {}
}

export class DeleteRecipeAction implements Action {
  readonly type: string = DELETE_RECIPE;
  constructor(public recipeId: number) {}
}

export class ReplaceAllRecipesAction implements Action {
  readonly type: string = REPLACE_ALL_RECIPES;
  constructor(public recipes: Recipe[]) {}
}

// When loading recipes from firebase, we update the state with these recipes
export class EffectFirebaseLoadRecipesAction implements Action {
  readonly type: string = EFFECT_FIREBASE_LOAD_RECIPE;
  constructor() {}
}

// When persisting to Firebase, the first step is to delete all existing recipes
export class EffectFirebasePersistDeleteRecipesAction implements Action {
  readonly type: string = EFFECT_FIREBASE_PERSIST_DELETE_RECIPES;
  constructor(public recipes: Recipe[]) {}
}

// When persisting to Firebase, the second step is to write all recipes
export class EffectFirebasePersistWriteRecipesAction implements Action {
  readonly type: string = EFFECT_FIREBASE_PERSIST_WRITE_RECIPES;
  constructor(public recipes: Recipe[]) {}
}
