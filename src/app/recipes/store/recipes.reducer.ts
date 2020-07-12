import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import { CREATE_RECIPE, UPDATE_RECIPE, DELETE_RECIPE, REPLACE_ALL_RECIPES, DeleteRecipeAction } from './recipes.actions';
import { CreateRecipeAction, ReplaceAllRecipesAction, UpdateRecipeAction } from './recipes.actions';
import { Ingredient } from 'src/app/shared/ingredient.model';


export interface RecipesState {
  recipes: Recipe[];
}

const initialState: RecipesState = {
  recipes: [
    new Recipe(0,
      'Pate de campagne',
      'Traditional french pork pate recipe !',
      '../../assets/images/pate-de-campagne.jpeg',
      [ new Ingredient('Bread', 2), new Ingredient('Pate', 4) ]),
  new Recipe(1,
      'Chicken Sandwich',
      'Fresh baguette with delicious chicken slices !',
      '../../assets/images/chicken-sandwich.jpeg',
      [ new Ingredient('Bread', 2), new Ingredient('Chicken', 1) ]),
  new Recipe(2,
      'Roasted Chicken',
      'A full roasted chicken with small potatoes !',
       '../../assets/images/poulet-roti.jpg',
       [ new Ingredient('Potato', 5), new Ingredient('Chicken', 1) ])
  ]
};

/**
 * Reducer for the Recipes Redux actions
 */
export function RecipesReducer(
    state: RecipesState = initialState,
    action: Action) {
  console.log(action);
  switch (action.type) {

    case CREATE_RECIPE:
      const createRecipeAction = action as CreateRecipeAction;
      return {
        ... state,
        recipes: [
          ... state.recipes,
          createRecipeAction.recipe
        ]
      };

    case UPDATE_RECIPE:
      const updateRecipeAction = action as UpdateRecipeAction;
      const recipesAfterUpdate = [];
      for (const recipe of state.recipes) {
        if (recipe.id === updateRecipeAction.recipe.id) {
          // insert the updated recipe
          recipesAfterUpdate.push(updateRecipeAction.recipe.clone());
        } else {
          // insert the same recipe as in current state
          recipesAfterUpdate.push(recipe.clone());
        }
      }
      return {
        ...state,
        recipes: recipesAfterUpdate
      };

    case DELETE_RECIPE:
      const deleteRecipeAction = action as DeleteRecipeAction;
      const recipesAfterDelete = [];
      for (const recipe of state.recipes) {
        if (recipe.id !== deleteRecipeAction.recipeId) {
          // insert the same recipe as in current state
          recipesAfterDelete.push(recipe.clone());
        }
      }
      return {
        ...state,
        recipes: recipesAfterDelete
      };

      case REPLACE_ALL_RECIPES:
        const replaceRecipesAction = action as ReplaceAllRecipesAction;
        return {
          ...state,
          recipes: replaceRecipesAction.recipes
        };

      default:
      return state;
  }
}
