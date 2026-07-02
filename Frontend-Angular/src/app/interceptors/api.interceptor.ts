import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable, Subject, switchMap, filter, take } from 'rxjs';

const isProduction = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
const API_BASE_URL = isProduction 
  ? 'https://sirenstorewebapp.onrender.com/api'
  : 'https://localhost:7009/api';

let isRefreshing = false;
const refreshDone$ = new Subject<string>();

export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');
  let authReq = req;
  if (token) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!error.status) {
        return throwError(() => new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.'));
      }

      if (error.status === 401) {
        return handle401(req, next);
      }

      const errorData = error.error as any;
      let errorMessage = 'Beklenmeyen bir hata oluştu.';
      if (errorData) {
        const type = errorData.type || errorData.Type;
        const errors = errorData.errors || errorData.Errors;
        const msg = errorData.message || errorData.Message;

        if (type === 'ValidationError' && errors) {
          errorMessage = errors.map((e: any) => e.errorMessage || e.ErrorMessage).join('\n') || 'Lütfen form verilerini kontrol edin.';
        } else if (msg) {
          errorMessage = msg;
        }
      }
      const customError = new Error(errorMessage) as any;
      if (errorData) {
        customError.error = errorData;
      }
      return throwError(() => customError);
    })
  );
};

function handle401(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> {
  if (isRefreshing) {
    return refreshDone$.pipe(
      filter(t => !!t),
      take(1),
      switchMap(newToken => next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })))
    );
  }

  isRefreshing = true;
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    isRefreshing = false;
    doLogout();
    return throwError(() => new Error('Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.'));
  }

  return new Observable(observer => {
    fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refreshToken)
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        isRefreshing = false;
        refreshDone$.next(data.accessToken);
        next(req.clone({ setHeaders: { Authorization: `Bearer ${data.accessToken}` } })).subscribe(observer);
      })
      .catch(() => {
        isRefreshing = false;
        doLogout();
        observer.error(new Error('Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.'));
      });
  });
}

function doLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.dispatchEvent(new Event('auth-logout'));
}

export { API_BASE_URL };
