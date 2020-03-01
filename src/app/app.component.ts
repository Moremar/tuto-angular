import { Component } from '@angular/core';

// Need to be imported for the bootstrap JS code to work (open dropdowns...)
// here we comment it out and do this JS work manually in a @Dropdown() directive
// import '../../node_modules/bootstrap/dist/js/bootstrap.bundle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // selectedRoute = 'Recipes';

  // onRouteChanged(route: string) {
  //   this.selectedRoute = route;
  // }

  // isRecipesSelected() {
  //   return this.selectedRoute === 'Recipes';
  // }

  // isShoppingListSelected() {
  //   return this.selectedRoute === 'Shopping List';
  // }
}
