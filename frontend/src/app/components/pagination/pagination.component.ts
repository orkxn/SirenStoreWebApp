import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, LucideChevronLeft, LucideChevronRight],
  template: `
    <div *ngIf="totalPages > 1" class="flex items-center justify-center gap-2 mt-8 select-none">
      <!-- Previous Button -->
      <button
        [disabled]="currentPage === 1"
        (click)="changePage(currentPage - 1)"
        class="w-10 h-10 rounded-xl border border-zinc-950/10 dark:border-white/10 flex items-center justify-center hover:bg-zinc-950/5 dark:hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Önceki Sayfa"
      >
        <svg lucideChevronLeft class="text-zinc-900 dark:text-zinc-100 w-4 h-4"></svg>
      </button>

      <!-- Page Numbers -->
      <button
        *ngFor="let page of pages"
        (click)="changePage(page)"
        [class]="'w-10 h-10 rounded-xl border flex items-center justify-center font-semibold text-sm transition-all cursor-pointer ' + 
          (page === currentPage
            ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white shadow-md'
            : 'border-zinc-950/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5')"
      >
        {{ page }}
      </button>

      <!-- Next Button -->
      <button
        [disabled]="currentPage === totalPages"
        (click)="changePage(currentPage + 1)"
        class="w-10 h-10 rounded-xl border border-zinc-950/10 dark:border-white/10 flex items-center justify-center hover:bg-zinc-950/5 dark:hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Sonraki Sayfa"
      >
        <svg lucideChevronRight class="text-zinc-900 dark:text-zinc-100 w-4 h-4"></svg>
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 9;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const start = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - 4));
    return Array.from({ length: Math.min(5, this.totalPages) }, (_, i) => start + i);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
