import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme: Theme;

  get theme(): Theme { return this._theme; }

  constructor() {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this._theme = savedTheme;
    } else {
      this._theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    this.applyTheme();
  }

  toggleTheme() {
    this._theme = this._theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('theme', this._theme);
  }

  private applyTheme() {
    const root = document.documentElement;
    if (this._theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
