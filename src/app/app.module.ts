import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AuthInterceptor } from './auth/auth-interceptor.service';
import { AlertComponent } from './shared/alert/alert.component';
// import { RecipesModule } from './recipes/recipes.module';   // removed if lazy loading
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ShoppingListReducer } from './shopping-list/store/shopping-list.reducer';


/* If no custom routing module, add the routes here  */
// const routes: Routes = [
//   { path: '', component: RecipesComponent, pathMatch: 'full' },
//   { path: 'recipes', component: RecipesComponent },
//   { path: 'shopping-list', component: ShoppingListComponent },
// ];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotFoundComponent
  ],
  imports: [
    // Browser must be imported ONLY in app.module
    // other modules should import CommonModule instead
    BrowserModule,
    HttpClientModule,
    // ROUTING
    // if no custom routing module and "routes" array in this file :
    // RouterModule.forRoot(routes)
    // else add the custom routing module AppRoutingModule
    // if we have feature modules with child routes, add them first
    // so they are included before the "not found" route !
    SharedModule,
//    RecipesModule,
    ShoppingListModule,
    AuthModule,
    AppRoutingModule,
    // Redux store module, taking a map of store section/reducers
    StoreModule.forRoot({
      shoppingList: ShoppingListReducer
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  // components that can be created dynamically from code
  entryComponents: [
    AlertComponent
  ]
})
export class AppModule { }
