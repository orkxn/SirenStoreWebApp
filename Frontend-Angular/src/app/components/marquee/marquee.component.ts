import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full overflow-hidden py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 select-none">
      <div
        class="flex gap-16 whitespace-nowrap animate-marquee-infinite"
        [style.animation-duration]="duration"
        [style.animation-direction]="reverse ? 'reverse' : 'normal'"
      >
        <div class="flex gap-16 items-center shrink-0">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class MarqueeComponent {
  @Input() speed: 'slow' | 'medium' | 'fast' = 'medium';
  @Input() reverse = false;

  get duration(): string {
    return this.speed === 'slow' ? '45s' : this.speed === 'fast' ? '15s' : '30s';
  }
}
