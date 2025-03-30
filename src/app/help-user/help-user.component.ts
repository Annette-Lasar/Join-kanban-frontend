import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckIfLoggedInService } from '../shared/services/check-if-logged-in.service';

@Component({
  selector: 'join-help-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './help-user.component.html',
  styleUrl: './help-user.component.scss',
})
export class HelpUserComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private checkIfLoggedInService: CheckIfLoggedInService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.checkIfLoggedInService.checkIfLoggedIn();
  }
}
