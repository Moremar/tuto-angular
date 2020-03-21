import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  // must append ".json" to the endpoint for Firebase to know how to save it
  // the auth token is added to the request by the AuthInterceptor
  private firebaseUrl = 'https://myrecipes-6270c.firebaseio.com/recipes.json';

  private recipes: Recipe[] = [
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
         [ new Ingredient('Potatoes', 5), new Ingredient('Chicken', 1) ])
  ];


  // alert when the recipes changed, subscribe to it to react
  recipesChanged = new Subject<void>();


  constructor(private http: HttpClient) {}

  getRecipes() {
    // get a snapshot of the recipes (read-only)
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    for (const recipe of this.recipes) {
      if (recipe.id === id) {
        return recipe.clone();
      }
    }
    // invalid ID, return an empty recipe
    console.log('ERROR : No recipe with ID = ' + id);
    return new Recipe();
  }

  getNextId() {
    let maxId = -1;
    for (const recipe of this.recipes) {
      if (recipe.id > maxId) {
        maxId = recipe.id;
      }
    }
    return maxId + 1;
  }

  createRecipe(recipe: Recipe): number {
    if (recipe.id === -1) {
      recipe.id = this.getNextId();
      this.recipes.push(recipe);
      this.recipesChanged.next();
      return recipe.id;
    } else {
      console.log('ERROR : The new recipe must have an ID of -1');
    }
  }

  updateRecipe(recipe: Recipe) {
    for (let i = 0; i < this.recipes.length; i++) {
      if (this.recipes[i].id === recipe.id) {
        this.recipes[i] = recipe;
        this.recipesChanged.next();
        return;
      }
    }
    console.log('ERROR: No recipe to update with ID = ' + recipe.id);
  }

  deleteRecipe(recipeId: number) {
    for (let i = 0; i < this.recipes.length; i++) {
      if (this.recipes[i].id === recipeId) {
        this.recipes.splice(i, 1);
        this.recipesChanged.next();
        return;
      }
    }
    console.log('ERROR: No recipe to delete with ID = ' + recipeId);
  }

  /*
   * Simplistic way to persist recipes in Firebase :
   *  - we delete all existing recipes
   *  - we put all recipes from the "recipes" array
   * That is of course not an acceptable solution in prod but ok for this tuto
   * (since we would lose all recipes if crash between the delete and the put)
   */
  persistRecipes() {
    console.log('Get recipes from Firebase.');

    // delete all existing recipes in Firebase
    const deleteReq = this.http.delete(this.firebaseUrl);
    deleteReq.subscribe(
      /* Success callback */
      (data: null) => {
        console.log('Deleted all recipes from Firebase.');
        // need to save recipes AFTER deletion of existing ones
        // so it must be in the callback of the deletion
        // (to ensure the order of the operations)
        this.persistRecipesInFirebase();
      },
      /* Error callback */
      (error: HttpErrorResponse) => {
        console.log('Failed to delete all recipes from Firebase :');
        console.log(error);
      }
    );
  }

  private persistRecipesInFirebase() {
    // Save 1 by 1 all recipes in Firebase
    // The "recipes" folder is created in Firebase if missing
    for (const recipe of this.recipes) {
      const postReq = this.http.post(this.firebaseUrl, recipe);
      postReq.subscribe( (data: {name: string}) => {
        console.log('Posted recipe ' + recipe.id + ' :');
        console.log(data);
      });
    }
  }

  /*
   * Replace the local recipes array by the recipes stored in Firebase
   */
  loadRecipes() {
    this.http.get(this.firebaseUrl)
        /* Convert the data to get a nice array of recipes */
        .pipe(map((data: {[key: string]: Recipe}) => {
          const recipes: Recipe[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              /* Create new to have a real Recipe with clone() method */
              const ingredients: Ingredient[] = [];
              if (data[key].hasOwnProperty('ingredients')) {
                for (const ing of data[key].ingredients) {
                  /* Make a real Ingredient so it has the clone() method */
                  ingredients.push(new Ingredient(ing.name, ing.amount));
                }
              }
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
        }))
        .subscribe(recipes => {
          console.log(recipes);
          this.recipes = recipes.sort(
            (r1, r2): number => r1.id - r2.id
          );
          this.recipesChanged.next();
        });
  }
}
