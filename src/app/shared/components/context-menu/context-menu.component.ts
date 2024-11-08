import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { ContactStatusService } from '../../services/contact-status.service';

@Component({
  selector: 'join-context-menu',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent implements OnInit {
  contactDetailFormStatus: boolean = false;

  constructor(private contactStatusService: ContactStatusService) {}

  ngOnInit(): void {
    this.contactStatusService.contactDetailFormStatus$.subscribe((status) => {
      this.contactDetailFormStatus = status;
    });
  }
}
