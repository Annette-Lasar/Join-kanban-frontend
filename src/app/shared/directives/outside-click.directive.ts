import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { BoardStatusService } from '../services/board-status.service';

@Directive({
  selector: '[appOutsideClick]',
  standalone: true,
})
export class OutsideClickDirective {
  @Input() isActive: boolean = true;
  @Output() outsideClick = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private boardStatusService: BoardStatusService,
  ) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: EventTarget | null) {
    if (
      this.isActive &&
      target instanceof HTMLElement &&
      !this.elementRef.nativeElement.contains(target)
    ) {
      this.outsideClick.emit();
      this.boardStatusService.setBoardSuccessStatus(false);
    }
  }
}
