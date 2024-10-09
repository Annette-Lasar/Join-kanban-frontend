import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'join-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() caption: string = '';
  @Input() buttonClass: string = '';
  @Input() buttonPadding: string = '';
  @Input() padding: string = '1em 1.5em';
  @Input() width: string = '75px';
  @Input() height: string = '75px';
  @Input() imgSrc: string = '';
  @Input() buttonIcon: boolean = false;
  @Input() alt: string = '';
}
