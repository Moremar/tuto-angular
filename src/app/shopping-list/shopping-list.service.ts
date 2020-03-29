import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import { AddIngredientAction, DeleteIngredientAction, ClearIngredientsAction, SelectIngredientAction } from './store/shopping-list.actions';
import { ShoppingListState } from './store/shopping-list.reducer';
import { AppState } from '../app.state';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  // must append ".json" to the endpoint for Firebase to know how to save it
  // the auth token is added to the request by the AuthInterceptor
  private firebaseUrl = 'https://myrecipes-6270c.firebaseio.com/ingredients.json';

  constructor(
    private http: HttpClient,
    private store: Store<AppState>) {}


  // get an observable on the ingredients in the store
  getIngredientsObs() {
    return this.store.select('shoppingList').pipe(
      map((shoppingListState: ShoppingListState) => shoppingListState.ingredients)
    );
  }

  getSelectedIngredientObs() {
    return this.store.select('shoppingList').pipe(
      map((shoppingListState: ShoppingListState) => shoppingListState.selectedIngredient)
    );
  }

  selectIngredient(ingredient: Ingredient) {
    this.store.dispatch(new SelectIngredientAction(ingredient));
  }

  deleteIngredient(ingredientName: string) {
    this.store.dispatch(new DeleteIngredientAction(ingredientName));
  }

  addIngredient(ingredient: Ingredient) {
    this.store.dispatch(new AddIngredientAction(ingredient));
  }

  clearIngredients() {
    this.store.dispatch(new ClearIngredientsAction());
  }

  /*
   * Simplistic way to persist ingredients in Firebase :
   *  - we delete all existing ingredients
   *  - we put all ingredients from the "ingredients" array
   * That is of course not an acceptable solution in prod but ok for this tuto
   * (since we would lose all ingredients if crash between the delete and the put)
   */
  persistIngredients() {
    console.log('Get ingredients from Firebase.');

    // delete all existing ingredients in Firebase
    const deleteReq = this.http.delete(this.firebaseUrl);
    deleteReq.subscribe(
      /* Success callback */
      (data: null) => {
        console.log('Deleted all ingredients from Firebase.');
        // need to save ingredients AFTER deletion of existing ones
        // so it must be in the callback of the deletion
        // (to ensure the order of the operations)
        this.persistIngredientsInFirebase();
      },
      /* Error callback */
      (error: HttpErrorResponse) => {
        console.log('Failed to delete all ingredients from Firebase :');
        console.log(error);
      }
    );
  }

  private persistIngredientsInFirebase() {
    // Save 1 by 1 all ingredients in Firebase
    // The "ingredients" folder is created in Firebase if missing
    this.getIngredientsObs().pipe(take(1)).subscribe(
      (ingredients: Ingredient[]) => {
        for (const ing of ingredients) {
          const postReq = this.http.post(this.firebaseUrl, ing);
          postReq.subscribe( (data: {name: string}) => {
            console.log('Posted ingredient ' + ing.name + ' :');
            console.log(data);
          });
        }
      }
    );
  }

  /*
   * Replace the local ingredients array by the ones stored in Firebase
   */
  loadIngredients() {
    this.http.get(this.firebaseUrl)
        /* Convert the data to get a nice array of ingredients */
        .pipe(map((data: {[key: string]: Ingredient}) => {
          const ingredients: Ingredient[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              /* Create new to have a real Ingredient with clone() method */
              ingredients.push(new Ingredient(
                data[key].name,
                data[key].amount
              ));
            }
          }
          return ingredients;
        }))
        .subscribe(ingredients => {
          this.clearIngredients();
          const sortedIngredients = ingredients.sort((a, b): number => a.amount - b.amount);
          for (const ing of sortedIngredients) {
            this.addIngredient(ing);
          }
        });
  }
}
