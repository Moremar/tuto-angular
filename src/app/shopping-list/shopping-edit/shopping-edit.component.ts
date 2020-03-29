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
    this.subscription = this.shoppingListService.getSelectedIngredientObs().subscribe(
      (ing: Ingredient) => {
        // first time it is called, the form is not yet created
        if (this.myShoppingForm) {
          this.myShoppingForm.form.setValue({
            ingredientName: ing ? ing.name : '',
            ingredientAmount: ing ? ing.amount : ''
          });
          }
      });
  }

  // reset the form and unselect any ingredient
  reset() {
    this.shoppingListService.selectIngredient(null);
    this.myShoppingForm.reset();
  }

  onAdd() {
    console.log(this.myShoppingForm);
    const name = this.myShoppingForm.value.ingredientName;
    const amount = this.myShoppingForm.value.ingredientAmount;
    const newIng = new Ingredient(name, amount);
    this.shoppingListService.addIngredient(newIng);
    this.reset();
  }

  onDelete() {
    const name = this.myShoppingForm.value.ingredientName;
    this.shoppingListService.deleteIngredient(name);
    this.reset();
  }

  onClear() {
    this.shoppingListService.clearIngredients();
    this.reset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
