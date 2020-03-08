import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { SelectARecipeComponent } from './recipes/select-a-recipe/select-a-recipe.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: 'login', component: AuthComponent },
    { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard],
    children: [
        { path: '', component: SelectARecipeComponent, pathMatch: 'full' },
        { path: 'new', component: RecipeEditComponent },
        { path: ':id', component: RecipeDetailComponent },
        { path: ':id/edit', component: RecipeEditComponent },
    ] },
    { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
