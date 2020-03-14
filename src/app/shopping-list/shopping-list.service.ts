import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ingredient } from '../shared/ingredient.model';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  // must append ".json" to the endpoint for Firebase to know how to save it
  // the auth token is added to the request by the AuthInterceptor
  private firebaseUrl = 'https://myrecipes-6270c.firebaseio.com/ingredients.json';

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  // subscribe to be notified when the ingredients list changes
  // ingredientsUpdated = new EventEmitter<void>();  // works but better to use Subject
  ingredientsUpdated = new Subject<void>();

  // subscribe to know which ingredient is being edited
  ingredientSelected = new Subject<number>();

  constructor(private http: HttpClient) {}

  getIngredients() {
    return this.ingredients.slice();
  }

  // we identify an ingredient by its index in the array
  getIngredient(i: number) {
    return this.ingredients[i].clone();
  }

  deleteIngredient(ingredientName: string) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].name === ingredientName) {
        // found the ingredient in the list, remove it
        this.ingredients.splice(i, 1);

        // this.ingredientsUpdated.emit();  // if using an EventEmitter
        this.ingredientsUpdated.next();
        return;
      }
    }
  }

  addIngredient(ingredient: Ingredient) {
    console.log('TIBO - ADD ingredient ' + ingredient.name);
    if (ingredient.name === '' || ingredient.amount === 0) {
      // invalid input, ignore it
      return;
    }
    for (const ing of this.ingredients) {
      if (ing.name === ingredient.name) {
        // found the ingredient in the list, add its amount
        ing.amount += ingredient.amount;
        this.ingredientsUpdated.next();
        return;
      }
    }
    // if we reach here, the ingredient was not in the list, so we add it
    this.ingredients.push(ingredient.clone());
    this.ingredientsUpdated.next();
  }

  clearIngredients() {
    this.ingredients = [];
    this.ingredientsUpdated.next();
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
    for (const ing of this.ingredients) {
      const postReq = this.http.post(this.firebaseUrl, ing);
      postReq.subscribe( (data: {name: string}) => {
        console.log('Posted ingredient ' + ing.name + ' :');
        console.log(data);
      });
    }
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
          console.log(ingredients);
          this.ingredients = ingredients.sort(
            (ing1, ing2): number => ing1.amount - ing2.amount
          );
          this.ingredientsUpdated.next();
        });
  }

}
