import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { LucideCheckCircle, LucideXCircle, LucideInfo, LucideAlertTriangle, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [
    CommonModule,
    LucideCheckCircle,
    LucideXCircle,
    LucideInfo,
    LucideAlertTriangle,
    LucideX
  ],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div
        *ngFor="let toast of (toastService.toasts$ | async)"
        class="pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-xl glass-surface bg-white/95 dark:bg-zinc-900/95 border border-zinc-950/10 dark:border-white/15 shadow-xl"
      >
        <div class="flex items-center gap-3">
          <!-- Success icon -->
          <svg *ngIf="toast.type === 'success'" lucideCheckCircle class="w-5 h-5 text-zinc-950 dark:text-white"></svg>
          <!-- Error icon -->
          <svg *ngIf="toast.type === 'error'" lucideXCircle class="w-5 h-5 text-red-500"></svg>
          <!-- Info icon -->
          <svg *ngIf="toast.type === 'info'" lucideInfo class="w-5 h-5 text-zinc-900 dark:text-zinc-100"></svg>
          <!-- Warning icon -->
          <svg *ngIf="toast.type === 'warning'" lucideAlertTriangle class="w-5 h-5 text-amber-500"></svg>
          <p class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{{ toast.message }}</p>
        </div>
        <button (click)="toastService.removeToast(toast.id)" class="text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center justify-center">
          <svg lucideX class="w-4 h-4"></svg>
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
