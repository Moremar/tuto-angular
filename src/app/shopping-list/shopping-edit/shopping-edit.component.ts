import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ShoppingListService } from '../shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.model';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('myShoppingForm') myShoppingForm: NgForm;

  constructor(private shoppingListService: ShoppingListService) {}

  // if an ingredient is being edited (-1 if nothing edited)
  editedIngredientId = -1;

  // subscription to clean up on destroy
  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.shoppingListService.ingredientSelected.subscribe(
      (ing: Ingredient) => {
        this.myShoppingForm.form.setValue({
          ingredientName: ing.name,
          ingredientAmount: ing.amount
        });
      });
  }

  onAdd() {
    console.log(this.myShoppingForm);
    const name = this.myShoppingForm.value.ingredientName;
    const amount = this.myShoppingForm.value.ingredientAmount;
    const newIng = new Ingredient(name, amount);
    this.shoppingListService.addIngredient(newIng);
    this.myShoppingForm.reset();
  }

  onDelete() {
    const name = this.myShoppingForm.value.ingredientName;
    this.shoppingListService.deleteIngredient(name);
    this.myShoppingForm.reset();
  }

  onClear() {
    this.shoppingListService.clearIngredients();
    this.myShoppingForm.reset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
