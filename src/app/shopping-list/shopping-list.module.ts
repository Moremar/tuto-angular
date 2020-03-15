import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';

import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';

/**
 * Feature module for the shopping list
 *
 * The routing will be done inside this module
 * Check recipes module for an example of feature routing module
 */

const routes: Routes = [
  { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    SharedModule, // contains CommonModule as well
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ShoppingListComponent
  ]
})
export class ShoppingListModule { }
