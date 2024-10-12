import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appOutsideClick]',
  standalone: true
})
export class OutsideClickDirective {
  @Input() isActive: boolean = true; // Kontrolliert, ob Klicks erfasst werden
  @Output() outsideClick = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: HTMLElement) {
    if (this.isActive && !this.elementRef.nativeElement.contains(target)) {
      this.outsideClick.emit();
    }
  }
}

