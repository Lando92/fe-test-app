import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {retryWhen, takeUntil, catchError} from 'rxjs/operators';
import {ToasterService} from '../../../shared/services/toaster.service';
import {tap} from 'rxjs/internal/operators';


@Injectable({
  providedIn: 'root'
})
export class ErrorsInterceptor implements HttpInterceptor {
  shared: string | any;

  constructor(private toasterService: ToasterService) {
  }

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
          this.toasterService.showErrorToaster(error.error.message);
        return of(error);
      })
    );
  }
}
