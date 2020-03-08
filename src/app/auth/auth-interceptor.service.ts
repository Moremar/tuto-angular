import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

import { AuthService } from './auth.service';


/**
 * Interceptor to add the auth token to every HTTP request
 * 
 * Interceptors do not take the providedIn prop in the @Injectable decorator 
 * instead they need to be added to the providers in the module
 * they uses the key "HTTP_INTERCEPTORS" in the providers
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authReq = req.clone({
            params: req.params.append('auth', this.authService.getToken())
        });
        return next.handle(authReq);
    }
}
