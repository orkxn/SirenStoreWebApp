import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideX],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div (click)="onClose.emit()" class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

      <!-- Modal Panel -->
      <div class="relative w-full max-w-lg glass-surface bg-white/90 dark:bg-zinc-900/90 border border-zinc-950/10 dark:border-white/15 rounded-3xl p-6 shadow-2xl text-left z-10">
        <!-- Close Button -->
        <button
          (click)="onClose.emit()"
          class="absolute top-4 right-4 p-1.5 rounded-full border border-zinc-950/10 dark:border-white/10 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center justify-center"
          aria-label="Kapat"
        >
          <svg lucideX class="w-4 h-4"></svg>
        </button>

        <!-- Header -->
        <h3 *ngIf="title" class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4 pr-8">{{ title }}</h3>

        <!-- Content -->
        <div class="max-h-[75vh] overflow-y-auto pr-1">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() onClose = new EventEmitter<void>();
}
