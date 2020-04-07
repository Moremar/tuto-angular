import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipesSub: Subscription;
  recipes: Recipe[];

  constructor(private recipesService: RecipesService, private router: Router) { }

  ngOnInit() {
    // load the initial recipes
    this.recipesSub = this.recipesService.getRecipesObs().subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
  }

  ngOnDestroy() {
    this.recipesSub.unsubscribe();
  }

  onNewRecipeClick() {
    this.router.navigate(['recipes', 'new']);
  }
}
