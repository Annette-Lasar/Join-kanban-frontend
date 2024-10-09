import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'join-user-greeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-greeting.component.html',
  styleUrl: './user-greeting.component.scss',
})
export class UserGreetingComponent implements OnInit {
  salutation: string = '';
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.getSalutation();
    
  }

  getSalutation() {
    const currentTime: number = new Date().getHours(); // Aktuelle Stunde (0-23)

    if (currentTime >= 0 && currentTime < 12) {
      this.salutation = 'Good morning';
    } else if (currentTime >= 12 && currentTime < 18) {
      this.salutation = 'Good afternoon';
    } else if (currentTime >= 18 && currentTime < 22) {
      this.salutation = 'Good evening';
    } else {
      this.salutation = 'Good night';
    }
  }
}
