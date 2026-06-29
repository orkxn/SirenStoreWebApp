import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="'animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ' + className"></div>`
})
export class SkeletonComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-product-card-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="flex flex-col border border-zinc-950/5 dark:border-white/10 rounded-2xl p-4 bg-zinc-950/[0.01] dark:bg-white/[0.01]">
      <app-skeleton className="aspect-square w-full rounded-xl mb-4"></app-skeleton>
      <div class="flex justify-between items-center mb-2">
        <app-skeleton className="h-3 w-16"></app-skeleton>
        <app-skeleton className="h-4 w-20 rounded-full"></app-skeleton>
      </div>
      <app-skeleton className="h-4 w-3/4 mb-2"></app-skeleton>
      <app-skeleton className="h-3 w-full mb-1"></app-skeleton>
      <app-skeleton className="h-3 w-5/6 mb-4"></app-skeleton>
      <div class="flex items-center justify-between mt-auto pt-3 border-t border-zinc-950/5 dark:border-white/5">
        <app-skeleton className="h-5 w-24"></app-skeleton>
        <app-skeleton className="h-9 w-9 rounded-full"></app-skeleton>
      </div>
    </div>
  `
})
export class ProductCardSkeletonComponent {}

@Component({
  selector: 'app-product-grid-skeleton',
  standalone: true,
  imports: [CommonModule, ProductCardSkeletonComponent],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <app-product-card-skeleton *ngFor="let i of items"></app-product-card-skeleton>
    </div>
  `
})
export class ProductGridSkeletonComponent {
  @Input() count = 8;
  get items() { return Array.from({ length: this.count }); }
}

@Component({
  selector: 'app-order-row-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 bg-zinc-950/[0.01] dark:bg-white/[0.01]">
      <div class="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-zinc-950/5 dark:border-white/5">
        <div class="flex gap-4">
          <div>
            <app-skeleton className="h-3 w-12 mb-1.5"></app-skeleton>
            <app-skeleton className="h-4 w-24"></app-skeleton>
          </div>
          <div>
            <app-skeleton className="h-3 w-12 mb-1.5"></app-skeleton>
            <app-skeleton className="h-4 w-16"></app-skeleton>
          </div>
        </div>
        <app-skeleton className="h-7 w-20 rounded-full"></app-skeleton>
      </div>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <app-skeleton className="w-12 h-12 rounded-lg"></app-skeleton>
          <div class="flex-grow">
            <app-skeleton className="h-4 w-1/3 mb-2"></app-skeleton>
            <app-skeleton className="h-3 w-8"></app-skeleton>
          </div>
          <app-skeleton className="h-4 w-16"></app-skeleton>
        </div>
      </div>
    </div>
  `
})
export class OrderRowSkeletonComponent {}
