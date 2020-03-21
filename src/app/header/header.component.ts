import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { RecipesService } from '../recipes/recipes.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
// import '../../../node_modules/bootstrap/dist/js/bootstrap.bundle';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authenticated = false;
  userSub: Subscription;

  constructor(
    private recipeService: RecipesService,
    private shoppingListService: ShoppingListService,
    private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.userSubject.subscribe(
      (user: User) => {
        this.authenticated = !!user;  // true if user != null
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
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

  onLogout() {
    this.authService.logout();
  }
}
