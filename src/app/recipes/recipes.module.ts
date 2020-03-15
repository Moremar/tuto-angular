import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipesRoutingModule } from './recipes-routing.module';
import { SelectARecipeComponent } from './select-a-recipe/select-a-recipe.component';
import { SharedModule } from '../shared/shared.module';

/**
 * Feature module for the recipes
 * We import here all components related to recipes
 */

@NgModule({
  // all elements related to recipes
  declarations: [
    RecipesComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeEditComponent,
    SelectARecipeComponent
  ],
  imports: [
    SharedModule, // contains CommonModule as well
    RouterModule,      // since we have <router-outlet>
    FormsModule,
    ReactiveFormsModule,
    RecipesRoutingModule  // containing our routing for recipes
  ],
  // all elements that need to be used by other modules
  // here nothing to ex
  exports: []
})
export class RecipesModule { }
