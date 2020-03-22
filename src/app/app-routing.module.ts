import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { NotFoundComponent } from './shared/not-found/not-found.component';


const routes: Routes = [
    // welcome page
    { path: '', redirectTo: 'recipes', pathMatch: 'full' },

    // lazy loading (we lazy load only the RecipesModule)
    { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) },

    // default route if invalid URL
    { path: '**', component: NotFoundComponent },
  ];

@NgModule({
  // Preload all lazily loaded modules
  imports: [ RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
