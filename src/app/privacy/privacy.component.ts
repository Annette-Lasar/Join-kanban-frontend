import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CheckIfLoggedInService } from '../shared/services/check-if-logged-in.service';

@Component({
  selector: 'join-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private checkIfLoggedInService: CheckIfLoggedInService) {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn(): void {
    this.isLoggedIn = this.checkIfLoggedInService.checkIfLoggedIn();
  }
}
