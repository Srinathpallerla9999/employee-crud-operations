import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        authorization: `Bearer ${this.auth.getToken()}`
      }
    })
    return next.handle(req).pipe(map((event: HttpEvent<any>) => {
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      // console.log(error);
      if (error.status === 401) {
        //this.auth.signOut();
        // this.router.navigate(['/auth/login']);
      }
      return throwError(error);
    }))
  }
}
