import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipeId: number;
  recipe: Recipe;

  constructor(private recipesService: RecipesService,
              private shoppingListRecipe: ShoppingListService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    const PARAM_ID = 'id';
    this.route.params.subscribe(
      (params: Params) => {
        this.recipeId = +params[PARAM_ID];
        this.recipe = this.recipesService.getRecipe(this.recipeId);
        if (this.recipe.id === -1) {
          // invalid ID in the URL, move to Home
          console.log('DEBUG : Invalid recipe, back to home.');
          this.router.navigate(['']);
        }
      }
    );

  }

  onAddToShoppingList() {
    for (const ingredient of this.recipe.ingredients) {
      this.shoppingListRecipe.addIngredient(ingredient);
    }
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipesService.deleteRecipe(this.recipeId);
    this.router.navigate(['']);  // the current recipe was deleted so back to home
  }
}
