import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly siteName = 'SIRENSTORE';

  constructor(private title: Title, private meta: Meta) {}

  /** ponytail: Lightweight wrapper over Angular's Title/Meta services. Only updates what's passed. */
  update(opts: { title?: string; description?: string }) {
    const pageTitle = opts.title
      ? `${opts.title} | ${this.siteName}`
      : `${this.siteName} | Trend Alışverişin Adresi`;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });

    if (opts.description) {
      this.meta.updateTag({ name: 'description', content: opts.description });
      this.meta.updateTag({ property: 'og:description', content: opts.description });
      this.meta.updateTag({ name: 'twitter:description', content: opts.description });
    }
  }
}
