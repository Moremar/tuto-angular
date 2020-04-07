import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import { Recipe } from './recipe.model';
import { AppState } from '../app.state';
import { RecipesState } from './store/recipes.reducer';
import { CreateRecipeAction, UpdateRecipeAction, DeleteRecipeAction,
  EffectFirebasePersistDeleteRecipesAction, EffectFirebaseLoadRecipesAction } from './store/recipes.actions';


@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(
    private router: Router,
    private store: Store<AppState>) {}


  // observable on the recipes in Redux
  getRecipesObs() {
    return this.store.select('recipes').pipe(map(
      (state: RecipesState) => {
        return state.recipes;
      }
    ));
  }


  // Fetch the recipe with a given ID from Redux
  // It is a one-time observable so no need to unsubscribe
  getRecipeObs(id: number) {
    return this.getRecipesObs().pipe(
      take(1),
      map(
        (recipes: Recipe[]) => {
          for (const recipe of recipes) {
            if (recipe.id === id) {
              return recipe;
            }
          }
          console.error('No recipe found with ID = ' + id);
          return new Recipe();
        }
      )
    );
  }


  createRecipe(recipe: Recipe) {
    console.log('Creating a new recipe.');
    if (recipe.id === -1) {
      this.getRecipesObs().pipe(take(1)).subscribe(
        (recipes: Recipe[]) => {
          let maxId = -1;
          for (const currRecipe of recipes) {
            if (currRecipe.id > maxId) {
              maxId = currRecipe.id;
            }
          }
          recipe.id = maxId + 1;
          this.store.dispatch(new CreateRecipeAction(recipe));
          this.router.navigate(['/recipes', recipe.id]);
        }
      );
    } else {
      console.error('The new recipe must have an ID of -1');
    }
  }


  updateRecipe(recipe: Recipe) {
    console.log('Updating recipe ' + recipe.id);
    this.store.dispatch(new UpdateRecipeAction(recipe));
    this.router.navigate(['/recipes', recipe.id]);
  }


  deleteRecipe(recipeId: number) {
    console.log('Deleting recipe ' + recipeId);
    this.store.dispatch(new DeleteRecipeAction(recipeId));
  }


  /*
   * Simplistic way to persist recipes in Firebase :
   *  - we delete all existing recipes
   *  - we put all recipes from the "recipes" array
   * That is of course not an acceptable solution in prod but ok for this tuto
   * (since we would lose all recipes if crash between the delete and the put)
   */
  persistRecipes() {
    console.log('Persisting recipes to Firebase');
    this.getRecipesObs().pipe(take(1)).subscribe(
      (recipes: Recipe[]) => {
        this.store.dispatch(new EffectFirebasePersistDeleteRecipesAction(recipes));
      }
    );
  }


  /*
   * Replace the local recipes array by the recipes stored in Firebase
   */
  loadRecipes() {
    console.log('Loading recipes from Firebase');
    this.store.dispatch(new EffectFirebaseLoadRecipesAction());
  }
}
