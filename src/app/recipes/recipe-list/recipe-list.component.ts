import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  subscription : Subscription;
  recipes: Recipe[];

  constructor(private recipesService: RecipesService, private router: Router) { }

  ngOnInit() {
    // load the initial recipes
    this.recipes = this.recipesService.getRecipes();

    // subscribe to reload recipes when they change
    this.subscription = this.recipesService.recipesChanged.subscribe(() => {
      this.recipes = this.recipesService.getRecipes();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNewRecipeClick() {
    this.router.navigate(['recipes', 'new']);
  }
}
