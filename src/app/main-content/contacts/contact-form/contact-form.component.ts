import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'join-contact-form',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit {
  @Input() isAddContactMode: boolean = true;
  isMobile: boolean = true;
  @Input() contactFormStatus: boolean = false;
  @Input() detailStatus: boolean = false;
  @Output() newContactFormStatus = new EventEmitter<boolean>();
  @Output() closeContactFormStatus = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.checkViewport();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 800;
  }


  closeContactForm() {
    this.contactFormStatus = false;
    this.isAddContactMode = true;
    this.closeContactFormStatus.emit(this.contactFormStatus);
  }
}
