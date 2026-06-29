import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true }
  ],
  host: {
    'class': 'block w-full'
  },
  template: `
    <div class="w-full flex flex-col gap-1.5 text-left">
      <label *ngIf="label" class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ label }}</label>
      <input
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="isDisabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class]="inputClasses"
        [attr.step]="step"
      />
      <span *ngIf="error" class="text-xs text-red-500 mt-0.5 font-medium">{{ error }}</span>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() error = '';
  @Input() step = '';
  @Input() className = '';

  value = '';
  isDisabled = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  get inputClasses(): string {
    const base = 'w-full bg-transparent border rounded-xl px-4 py-3 outline-none transition-all duration-300 text-zinc-900 dark:text-zinc-50';
    const state = this.error
      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
      : 'border-zinc-300 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white focus:border-zinc-950 dark:focus:border-white';
    return `${base} ${state} ${this.className}`;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled = isDisabled; }
}
