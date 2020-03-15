import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceholderDirective } from './placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { AlertComponent } from './alert/alert.component';
import { SpinnerComponent } from './spinner.component';

/**
 * Shared module
 * It exports all its components so other modules importing this module can
 * include them in the template of their components
 */

@NgModule({
  declarations: [
    DropdownDirective,
    SpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownDirective,
    SpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
    // we include the CommonModule so other modules do not need to import it
    CommonModule
  ]
})
export class SharedModule { }
