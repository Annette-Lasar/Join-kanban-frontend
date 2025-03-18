import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CheckIfLoggedInService } from '../shared/services/check-if-logged-in.service';

@Component({
  selector: 'join-legal-notice',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss',
})
export class LegalNoticeComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private checkIfLoggedInService: CheckIfLoggedInService) {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn(): void {
    this.isLoggedIn = this.checkIfLoggedInService.checkIfLoggedIn();
  }
}
