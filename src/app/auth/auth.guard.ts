import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { User } from './user.model';

/**
 * Guard added to all routes that need authentication
 * Redirect to login page if the user is not authenticated
 */

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.getUserObs().pipe(map(
      (user: User) => {
        if (!user) {
          console.log('User is not authenticated, redirect to the login page.');
          this.router.navigate(['/login']);
          return false;  // not required but clearer
        } else {
          return true;
        }
      }
    ));
  }
}
