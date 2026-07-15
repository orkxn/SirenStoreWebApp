import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { LucideMoon, LucideSun } from '@lucide/angular';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideMoon, LucideSun],
  template: `
    <button
      (click)="themeService.toggleTheme()"
      class="relative p-2 rounded-full border border-zinc-950/10 dark:border-white/10 bg-zinc-950/[0.02] dark:bg-white/5 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-all duration-300 w-10 h-10 flex items-center justify-center overflow-hidden"
      aria-label="Temayı Değiştir"
    >
      <!-- Moon icon (shown in light mode) -->
      <svg *ngIf="themeService.theme === 'light'" lucideMoon class="text-zinc-950 w-5 h-5"></svg>
      <!-- Sun icon (shown in dark mode) -->
      <svg *ngIf="themeService.theme === 'dark'" lucideSun class="text-zinc-50 w-5 h-5"></svg>
    </button>
  `
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}
