import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatPrice', standalone: true })
export class FormatPricePipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
  }
}
