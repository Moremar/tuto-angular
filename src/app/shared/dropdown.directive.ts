import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

/*
 * Custom directive to toggle dropdowns
 * The usual way is to include Bootstrap 4 JS code (from app.component.ts) that
 * automatically adds the "show" class to our options list element when the button
 * is click and removes it when we click outside :
 * import '../../node_modules/bootstrap/dist/js/bootstrap.bundle';
 *
 * Here we will not import the Bootstrap JS code, and instead we write our own
 * directive that will be attached to the dropdown toggle button.
 * It toggles the "show" class to the next sibling (the options list) on click
 * on the button, and close it on click anywhere in the page.
 *
 * To use it, we need to add the "appDropdown" directive to the button :
 *
 *  <div class="btn-group">
 *      <button type="button" appDropdown class="btn dropdown-toggle" data-toggle="dropdown"> Toggle </button>
 *      <div class="dropdown-menu">
 *          <button type="button" class="dropdown-item"> Option 1 </button>
 *          <button type="button" class="dropdown-item"> Option 2 </button>
 *      </div>
 *  </div>
 */

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {

    shouldShow = false;

    // inject the element and the renderer
    constructor(private elementRef: ElementRef, private rendererRef: Renderer2) {}

    // listener on a click anywhere in the document
    // if the click is on the button, toggle the menu, else close the menu
    // to access the $event of the event, we add ['$event'] parameter to @HostListener
    @HostListener('document:click', ['$event']) toggleMenu(event) {
        const target: HTMLElement = this.elementRef.nativeElement;
        this.shouldShow = (target === event.target) ? !this.shouldShow : false;
        if (this.shouldShow) {
            this.rendererRef.addClass(target.nextElementSibling, 'show');
        } else {
            this.rendererRef.removeClass(target.nextElementSibling, 'show');
        }
      }

}
