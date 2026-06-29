import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-transparent border rounded-xl px-4 py-3 outline-none transition-all duration-300 text-zinc-900 dark:text-zinc-50 ${
            error
              ? 'border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-zinc-300 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white focus:border-zinc-950 dark:focus:border-white'
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 mt-0.5 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
