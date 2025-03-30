import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
export class SummaryComponent implements OnInit, OnDestroy {
  summaries: SummaryData[] = [];

  isDesktop: boolean = false;
  showGreeting: boolean = false;
  showContent: boolean = false;

  private resizeObserver!: ResizeObserver;

  constructor(
    private summaryService: SummaryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSummaryData();
    this.initializeResizeObserver();
    this.handleFirstMobileGreeting();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  getSummaryData(): void {
    this.summaryService.fetchSummaryData().subscribe({
      next: (data) => {
        this.summaries = Array.isArray(data) ? data : [data];
      },
      error: (err) => {
        console.error('Fehler beim Abrufen der Summary-Daten:', err);
      },
    });
  }

  initializeResizeObserver(): void {
    this.isDesktop = window.innerWidth > 1024;

    this.resizeObserver = new ResizeObserver(() => {
      const current = window.innerWidth > 1024;
      if (this.isDesktop !== current) {
        this.isDesktop = current;
        this.cdr.detectChanges();
      }
    });

    this.resizeObserver.observe(document.body);
  }

  handleFirstMobileGreeting(): void {
    const alreadyGreeted = localStorage.getItem('alreadyGreeted');

    if (this.isDesktop) {
      this.showGreeting = true;
      this.showContent = true;
      return;
    }

    if (!alreadyGreeted) {
      this.showGreeting = true;
      localStorage.setItem('alreadyGreeted', 'true');

      setTimeout(() => {
        this.showGreeting = false;
        this.showContent = true;
      }, 2000);
    } else {
      this.showGreeting = false;
      this.showContent = true;
    }
  }
}
