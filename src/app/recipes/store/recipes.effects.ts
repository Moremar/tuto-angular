import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { EFFECT_FIREBASE_LOAD_RECIPE, EFFECT_FIREBASE_PERSIST_DELETE_RECIPES,
  EFFECT_FIREBASE_PERSIST_WRITE_RECIPES } from './recipes.actions';
import { EffectFirebaseLoadRecipesAction, ReplaceAllRecipesAction,
  EffectFirebasePersistDeleteRecipesAction, EffectFirebasePersistWriteRecipesAction } from './recipes.actions';
import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { of } from 'rxjs';

@Injectable()
export class RecipesEffects {

    // must append ".json" to the endpoint for Firebase to know how to save it
  // the auth token is added to the request by the AuthInterceptor
  private FIREBASE_URL = 'https://myrecipes-6270c.firebaseio.com/recipes.json';

  constructor(private actions$: Actions, private http: HttpClient) {}

  // effect to get all recipes from firebase and overwrite the recipes in Redux with them
  @Effect()
  loadFromFirebase = this.actions$.pipe(
    ofType(EFFECT_FIREBASE_LOAD_RECIPE),
    switchMap(
      (action: EffectFirebaseLoadRecipesAction) => {
        return this.http.get(this.FIREBASE_URL).pipe(
          /* Convert the data to get a nice array of recipes */
          map(
            (data: {[key: string]: Recipe}) => {
              const recipes: Recipe[] = [];
              for (const key in data) {
                if (data.hasOwnProperty(key)) {
                  const ingredients: Ingredient[] = [];
                  if (data[key].hasOwnProperty('ingredients')) {
                    for (const ing of data[key].ingredients) {
                      /* Make a real Ingredient so it has the clone() method */
                      ingredients.push(new Ingredient(ing.name, ing.amount));
                    }
                  }
                  /* Create new to have a real Recipe with clone() method */
                  recipes.push(new Recipe(
                    data[key].id,
                    data[key].name,
                    data[key].description,
                    data[key].imagePath,
                    ingredients,
                  ));
                }
              }
              return recipes;
            }
          ),
          // return the Redux action to overwrite recipes in Redux
          map(
            (recipes: Recipe[]) => {
              const sortedRecipes = recipes.sort(
                (r1, r2): number => r1.id - r2.id
              );
              return new ReplaceAllRecipesAction(sortedRecipes);
            }
          )
        );
      }
    )
  );

  // effect to delete all recipes from Firebase, and then call the action
  // to write all recipes from Redux to Firebase
  @Effect()
  persistToFirebaseDelete = this.actions$.pipe(
    ofType(EFFECT_FIREBASE_PERSIST_DELETE_RECIPES),
    switchMap(
      (action: EffectFirebasePersistDeleteRecipesAction) => {
        return this.http.delete(this.FIREBASE_URL).pipe(
          map(
            () => {
              console.log('Deleted all recipes from Firebase.');
              return new EffectFirebasePersistWriteRecipesAction(action.recipes);
            }
          ),
          catchError(
            (error: HttpErrorResponse) => {
              console.error('Failed to delete all recipes from Firebase :');
              console.error(error);
              return of({ type: 'ERROR'});   // on the fly action
            }
          )
        );
      }
    )
  );

  // effect to write recipes from Redux to Firebase
  // does not dispatch anything
  @Effect({dispatch: false})
  persistToFirebaseWrite = this.actions$.pipe(
    ofType(EFFECT_FIREBASE_PERSIST_WRITE_RECIPES),
    tap(
      (action: EffectFirebasePersistWriteRecipesAction) => {
        // Save 1 by 1 all recipes in Firebase
        // The "recipes" folder is created in Firebase if missing
        for (const recipe of action.recipes) {
          const postReq = this.http.post(this.FIREBASE_URL, recipe);
          postReq.subscribe( (data: {name: string}) => {
            console.log('Posted recipe ' + recipe.id + ' :');
            console.log(data);
          });
        }
      }
    )
  );
}
