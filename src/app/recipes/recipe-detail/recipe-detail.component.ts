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

  // Recipe being displayed (public for the HTML to use it)
  public recipe: Recipe;

  constructor(private recipesService: RecipesService,
              private shoppingListRecipe: ShoppingListService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    const PARAM_ID = 'id';
    this.route.params.subscribe(
      (params: Params) => {
        const recipeId = +params[PARAM_ID];
        this.recipesService.getRecipeObs(recipeId).subscribe(
          (recipe: Recipe) => {
            this.recipe = recipe;
          }
        );
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
    this.recipesService.deleteRecipe(this.recipe.id);
    this.router.navigate(['']);  // the current recipe was deleted so back to home
  }
}
