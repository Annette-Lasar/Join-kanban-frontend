import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs';
import { DataService } from './data.service';
import { SummaryData } from '../interfaces/summary.interface';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private summarySubject = new BehaviorSubject<SummaryData[]>([]); // ✅ Jetzt ist es ein Array!
  summary$ = this.summarySubject.asObservable();

  constructor(private dataService: DataService) {}

  fetchSummaryData(): Observable<SummaryData[]> {
    return this.dataService.fetchData<SummaryData>(
      'summary',
      this.summarySubject
    );
  }
}
