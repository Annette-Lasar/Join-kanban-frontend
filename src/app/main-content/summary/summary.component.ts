import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGreetingComponent } from './user-greeting/user-greeting.component';
import { SummaryService } from '../../shared/services/summary.service';
import { SummaryData } from '../../shared/interfaces/summary.interface';

@Component({
  selector: 'join-summary',
  standalone: true,
  imports: [UserGreetingComponent, CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnInit {
  summaries: SummaryData[] = [];

  constructor(private summaryService: SummaryService) {}

  ngOnInit(): void {
    this.getSummaryData();
  }


  getSummaryData(): void {
    this.summaryService.fetchSummaryData().subscribe({
      next: (data) => {
        console.log('Data: ', data);

        this.summaries = Array.isArray(data) ? data : [data];
      },
      error: (err) => {
        console.error('Fehler beim Abrufen der Summary-Daten:', err);
      },
    });
  }
}
