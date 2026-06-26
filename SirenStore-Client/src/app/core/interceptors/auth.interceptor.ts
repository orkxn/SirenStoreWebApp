import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Eğer token varsa, orijinal isteği klonlayıp içine Authorization Header'ı enjekte ediyoruz
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Klonlanmış ve token eklenmiş isteği yoluna devam ettiriyoruz
    return next(clonedRequest);
  }

  // Token yoksa isteğe hiç dokunmadan aynen backend'e gönderiyoruz (Örn: Login/Register istekleri)
  return next(req);
};