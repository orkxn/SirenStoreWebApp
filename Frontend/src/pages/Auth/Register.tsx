import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      showToast('Kayıt işleminiz başarılı! Şimdi giriş yapabilirsiniz.', 'success');
      navigate('/login');
    } catch (err: any) {
      showToast(err.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Yeni Hesap Oluştur
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Monokrom kulübünün bir parçası olun.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad"
              placeholder="Ahmet"
              error={errors.firstName?.message}
              {...register('firstName', { required: 'Ad alanı zorunludur.' })}
            />
            <Input
              label="Soyad"
              placeholder="Yılmaz"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Soyad alanı zorunludur.' })}
            />
          </div>

          <Input
            label="E-posta Adresi"
            type="email"
            placeholder="örnek@siren.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'E-posta adresi zorunludur.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Geçersiz e-posta adresi.',
              },
            })}
          />

          <Input
            label="Telefon Numarası"
            type="tel"
            placeholder="5xxxxxxxxx"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber', {
              required: 'Telefon numarası zorunludur.',
              pattern: {
                value: /^5\d{9}$/,
                message: 'Telefon numaranız 5 ile başlayan 10 haneli olmalıdır (Örn: 5XXXXXXXXX).',
              },
            })}
          />

          <div className="relative">
            <Input
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Şifre zorunludur.',
                minLength: {
                  value: 6,
                  message: 'Şifre en az 6 karakter olmalıdır.',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
            className="group mt-2"
          >
            {isLoading ? 'Kaydediliyor...' : (
              <span className="flex items-center gap-2">
                Hesap Oluştur <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-zinc-950/5 dark:border-white/5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="font-semibold text-zinc-950 dark:text-white hover:underline">
              Giriş Yapın
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
