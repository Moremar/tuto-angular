import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Directive to add on <ng-template> tags to create dynamically a component
 * It must expose the container view ref as PUBLIC so the TS code of the component 
 * where we should create dynamically a new component can access it.
 */
@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

  constructor(public viewContainerRef: ViewContainerRef) {}
}
