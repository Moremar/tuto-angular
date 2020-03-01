import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes/recipes.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
// import '../../../node_modules/bootstrap/dist/js/bootstrap.bundle';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private recipeService: RecipesService, 
    private shoppingListService: ShoppingListService) {}

  ngOnInit() {
  }

  // persist the recipes and ingredients in Firebase via HTTP
  saveData() {
    this.recipeService.persistRecipes();
    this.shoppingListService.persistIngredients();
  }

  // load the recipes and ingredients from Firebase via HTTP
  fetchData() {
    this.recipeService.loadRecipes();
    this.shoppingListService.loadIngredients();
  }
}
