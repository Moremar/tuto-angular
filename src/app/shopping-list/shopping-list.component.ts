import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  ingredientsSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();

    // listener to refresh the local ingredients list when it changes
    this.ingredientsSubscription =
        this.shoppingListService.ingredientsUpdated.subscribe(
          () => { this.ingredients = this.shoppingListService.getIngredients(); }
        );
  }

  // onEdit(ingredient: Ingredient) {
  //   for (let i = 0; i < this.ingredients.length; i++) {
  //     if (this.ingredients[i].name === ingredient.name) {
  //       const newAmount = Math.max(0, this.ingredients[i].amount + ingredient.amount);
  //       if (newAmount > 0) {
  //         this.ingredients[i].amount = newAmount;
  //       } else {
  //         this.ingredients.splice(i, 1);
  //       }
  //       return;
  //     }
  //   }
  //   // if we reach here, the ingredient was not in the list
  //   if (ingredient.amount > 0) {
  //     this.ingredients.push(
  //       new Ingredient(ingredient.name, ingredient.amount)
  //     );
  //   }
  // }

  ngOnDestroy(): void {
    // remove the subscription when the component is destroyed
    this.ingredientsSubscription.unsubscribe();
  }

  onClear() {
    this.ingredients = [];
  }

  onIngredientSelected(index: number) {
    this.shoppingListService.ingredientSelected.next(index);
  }
}
