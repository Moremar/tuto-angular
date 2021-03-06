import { Component, OnInit, PACKAGE_ROOT_URL, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  myRecipeForm: FormGroup;

  recipe = new Recipe();
  recipeId = -1;          // -1 for a new recipe
  editExisting = false;
  buttonLabel = 'Create';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService) {}

  ngOnInit() {
    // retrieve the ID if we are editing an existing recipe
    const PARAM_ID = 'id';
    this.route.params.subscribe(
      (params: Params) => {
        this.recipeId = (PARAM_ID in params) ? +params[PARAM_ID] : -1;
        this.editExisting = (this.recipeId !== -1);
        this.buttonLabel = this.editExisting ? 'Update' : 'Create';
        if (this.editExisting) {
          // fetch the recipe with this ID
          this.recipesService.getRecipeObs(this.recipeId).subscribe(
            (recipe: Recipe) => {
              this.recipe = recipe.clone();
            }
          );
        } else {
          this.recipe = new Recipe();
        }
        this.loadForm();
      }
    );
  }

  // Create the reactive form
  // We need a reactive form because we have a dynamic array of ingredients
  private loadForm() {
    const recipeName = this.recipe.name;
    const imagePath = this.recipe.imagePath;
    const description = this.recipe.description;
    const ingredients = new FormArray([]);
    for (const ing of this.recipe.ingredients) {
      // each ingredient is a form group of 2 controls (name and amount)
      ingredients.push(new FormGroup({
        name: new FormControl(ing.name, Validators.required),
        amount: new FormControl(ing.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      }));
    }

    this.myRecipeForm = new FormGroup({
      recipeName: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients: ingredients
    });
  }

  onSubmit() {
    this.keepChangesInRecipe();
    console.log(this.myRecipeForm);
    if (this.editExisting) {
      console.log(this.recipeId);
      console.log(this.recipe);
      this.recipesService.updateRecipe(this.recipe);
    } else {
      this.recipesService.createRecipe(this.recipe);
    }
  }

  // there is no 2 ways binding in the form
  // when we add or remove components, we need to manually reflect
  // the changes in the GUI in our local recipe object
  // this does not save the recipe though.
  private keepChangesInRecipe() {
    this.recipe.name = this.myRecipeForm.value.recipeName;
    this.recipe.imagePath = this.myRecipeForm.value.imagePath;
    this.recipe.description = this.myRecipeForm.value.description;
    this.recipe.ingredients = [];
    for (const ing of this.myRecipeForm.value.ingredients) {
      this.recipe.ingredients.push(new Ingredient(ing.name, ing.amount));
    }
  }

  onAddIngredient() {
    this.keepChangesInRecipe();
    this.recipe.ingredients.push(new Ingredient());
    this.loadForm();
  }

  deleteIngredient(index: number) {
    this.keepChangesInRecipe();
    this.recipe.ingredients.splice(index, 1);
    this.loadForm();
  }

  onCancel() {
    // goes back either to home (if creating new) or to the edited recipe
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  getAllControls() {
    return (this.myRecipeForm.get('ingredients') as FormArray).controls;
  }
}
