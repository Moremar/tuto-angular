import { Component } from "@angular/core";

/*
 * The spinner HTML (template) and CSS (style) are copied from :
 * https://loading.io/css/
 */

@Component({
    selector: 'app-spinner',
    styleUrls: [ 'spinner.component.css' ],
    template: '<div class="lds-ripple"><div></div><div></div></div>'
})
export class SpinnerComponent {
  // no business logic, just a visual animation
}