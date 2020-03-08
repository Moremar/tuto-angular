import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

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
    private router: Router)
  {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.authService.getToken()) {
      // no auth token was found, the user is not authenticated
      console.log('User is not authenticated, redirect to the login page.');
      this.router.navigate(['/login']);  
      return false;  // not required but clearer
    }
    return true;
  }
}
