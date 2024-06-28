import { HttpInterceptorFn } from '@angular/common/http';

export const apiRequestInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.headers.has('Content-Type')) {
    req = req.clone({
      headers: req.headers.append('Content-Type', 'application/json'),
    });
  }

  req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
  return next(req);
};
