import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
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
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await login(data);
      showToast('Giriş işlemi başarıyla gerçekleştirildi!', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Tekrar Hoş Geldiniz
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Hesabınıza giriş yapın ve alışverişe başlayın.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            className="group"
          >
            {isLoading ? 'Giriş Yapılıyor...' : (
              <span className="flex items-center gap-2">
                Giriş Yap <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-zinc-950/5 dark:border-white/5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="font-semibold text-zinc-950 dark:text-white hover:underline">
              Kayıt Olun
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
