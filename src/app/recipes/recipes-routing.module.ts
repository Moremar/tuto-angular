import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { SelectARecipeComponent } from './select-a-recipe/select-a-recipe.component';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

/**
 * Routing module for RecipesModule
 */

console.log('LOADING');

const routes: Routes = [
  // without lazy loading, declare the "recipes" route :
  //  { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard],
  // with lazy loading, the "recipes" route is declared in app-routing.module.ts :
  { path: '', component: RecipesComponent, canActivate: [AuthGuard],
  children: [
      { path: '', component: SelectARecipeComponent, pathMatch: 'full' },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipeDetailComponent },
      { path: ':id/edit', component: RecipeEditComponent },
  ] },
];

@NgModule({
  declarations: [],
  imports: [
    // use forChild() to add some roots to the main router
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class RecipesRoutingModule { }
