import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from '../interfaces/category.interface';
import { BASE_URL } from '../data/global-variables.data';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private dataService: DataService) {}


  fetchData(): Observable<Category[]> {
      return this.dataService.fetchData<Category>('categories', this.categoriesSubject);
    }
  
    addData(category: Category): Observable<Category> {
      return this.dataService.addData<Category>('categories', category, this.categoriesSubject);
    }
  
    updateData(categoryId: number, updatedCategory: Category): Observable<Category> {
      return this.dataService.updateData<Category>('categories', categoryId, updatedCategory, this.categoriesSubject);
    }
  
    patchData(categoryId: number, partialUpdate: Partial<Category>): Observable<Category> {
      return this.dataService.patchData<Category>('categories', categoryId, partialUpdate, this.categoriesSubject);
    }
  
    deleteDatak(categoryId: number): Observable<void> {
      return this.dataService.deleteData<Category>('categories', categoryId, this.categoriesSubject);
    }
}





