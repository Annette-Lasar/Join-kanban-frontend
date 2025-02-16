import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../interfaces/task.interface';
import { Category } from '../../../interfaces/category.interface';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { RandomColorService } from '../../../services/random-color.service';
import { ButtonComponent } from '../../button/button.component';
import { InfoComponent } from '../../info/info.component';
import { InfoBoxService } from '../../../services/info-box.service';
import { ActionService } from '../../../services/action.service';
import { Subscription } from 'rxjs';

type CategoryField = 'color' | 'name';
type NewCategoryAction = 'show' | 'hide';

@Component({
  selector: 'join-categories-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InfoComponent],
  templateUrl: './categories-dropdown.component.html',
  styleUrl: './categories-dropdown.component.scss',
})
export class CategoriesDropdownComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() categories: Category[] = [];
  filteredCategories: Category[] = [];
  isCategoriesListVisible: boolean = false;
  selectedCategory: Category | null = null;
  isEditingCategoryId: number | null = null;
  selectedCategoryEdit: Category | null = null;
  selectedCategoryToDelete: number | null = null;
  newCategoryMode: boolean = false;
  newCategoryName: string = '';
  randomCategoryColor: string = this.createRandomColor();
  searchTerm: string = '';
  isWarningMessageVisible: boolean = false;
  private subscriptions = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private randomColorService: RandomColorService,
    private infoBoxService: InfoBoxService,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    this.initializeSelectedCategory();
    this.getPrepareDeleteCategorySubjectFromService();
    this.subscribeToDeleteCategorySubject();
    this.getUpdatedWarningBoxStatus();
  }

  initializeSelectedCategory(): void {
    if (this.task?.category) {
      this.selectedCategory = this.task.category;
    }
  }

  toggleCategoriesList(event: Event) {
    this.isCategoriesListVisible = !this.isCategoriesListVisible;
    event.stopPropagation();
    this.filterCategories();
  }

  setSelectedCategory(newCategory: Category): void {
    this.selectedCategory = newCategory;
    this.isCategoriesListVisible = false;
  }

  toggleNewCategoryButtons(action: NewCategoryAction, event: Event): void {
    event.stopPropagation();
    this.randomCategoryColor = this.createRandomColor();
    this.newCategoryMode = action === 'show';
  }

  createNewCategory(event: Event): void {
    if (!this.newCategoryName.trim()) return;

    const newCategory: Omit<Category, 'id'> = {
      name: this.newCategoryName.trim(),
      color: this.randomCategoryColor,
      created_by: null,
    };

    this.toggleNewCategoryButtons('hide', event);
    this.saveNewCategory(newCategory);
}


saveNewCategory(newCategory: Omit<Category, 'id'>): void {
  this.categoryService.addData(newCategory).subscribe({
    next: (savedCategory) => {
      this.categories.push(savedCategory);
      this.filteredCategories = [...this.categories];
      this.newCategoryName = '';
      this.randomCategoryColor = this.createRandomColor();
    },
    error: (err) => console.error('Fehler beim Speichern der Kategorie', err),
  });
}


  toggleEditCategory(category: Category, event: Event): void {
    event.stopPropagation();
    this.isEditingCategoryId = category.id!;
    this.selectedCategoryEdit = { ...category };
  }

  abortEditCategory(event: Event): void {
    event.stopPropagation();
    this.isEditingCategoryId = null;
    this.selectedCategoryEdit = null;
  }

  updateCategoryItem(
    categoryId: number,
    field: CategoryField,
    event: Event
  ): void {
    const inputElement = event.target as HTMLInputElement;
    if (
      !inputElement ||
      !this.selectedCategoryEdit ||
      this.selectedCategoryEdit.id !== categoryId
    )
      return;

    const newItem = inputElement.value.trim();
    if (!newItem) return;

    this.selectedCategoryEdit[field] = newItem;
  }

  saveCategoryChanges(event: Event): void {
    event.stopPropagation();
    if (!this.selectedCategoryEdit) return;

    this.categoryService
      .updateData(this.selectedCategoryEdit.id!, this.getUpdatedCategory())
      .subscribe({
        next: (updatedCategory) => this.handleSuccessfulUpdate(updatedCategory),
        error: (err) => console.error('Fehler beim Speichern:', err),
      });
  }

  private getUpdatedCategory(): Required<Pick<Category, 'name' | 'color'>> {
    return {
      name: this.selectedCategoryEdit!.name!,
      color: this.selectedCategoryEdit!.color!,
    };
  }

  private handleSuccessfulUpdate(updatedCategory: Category): void {
    const index = this.categories.findIndex(
      (cat) => cat.id === updatedCategory.id
    );
    if (index !== -1) {
      this.categories[index] = updatedCategory;
      this.filteredCategories = [...this.categories];
    }

    this.resetEditMode();
  }

  private resetEditMode(): void {
    this.isEditingCategoryId = null;
    this.selectedCategoryEdit = null;
  }

  getPrepareDeleteCategorySubjectFromService(): void {
    const subscription = this.actionService.setItemToDelete$.subscribe(
      (categoryId) => {
        if (categoryId !== null) {
          this.selectedCategoryToDelete = categoryId;
          console.log(
            'Zum Zweiten: selectedCategoryToDelete: ',
            this.selectedCategoryToDelete
          );
        }
      }
    );
    this.subscriptions.add(subscription);
  }

  /*   subscribeToDeleteCategorySubject(): void {
    const subscription = this.actionService.deleteCategorySubject$.subscribe(
      (categoryId) => {
        console.log('Empfange: CategoryId: ', categoryId);
        if (categoryId !== null) {
          console.log('Rufe removeCategoryFromList auf mit ID: ', categoryId)
          this.removeCategoryFromList(categoryId);
        }
      }
    );
    this.subscriptions.add(subscription);
  } */

  subscribeToDeleteCategorySubject(): void {
    // Erst wenn der Button geklickt wird, starten wir das Abo!
    const subscription = this.actionService.deleteCategoryEvent.subscribe(
      () => {
        console.log('Button wurde geklickt. Jetzt lauschen wir auf die ID...');

        // Jetzt erst wird deleteCategorySubject$ abonniert
        const categorySubscription =
          this.actionService.deleteCategorySubject$.subscribe((categoryId) => {
            console.log('Empfange: CategoryId: ', categoryId);
            if (categoryId !== null) {
              console.log(
                'Rufe removeCategoryFromList auf mit ID: ',
                categoryId
              );
              this.removeCategoryFromList(categoryId);
            }
          });

        // Beide Subscriptions verwalten
        this.subscriptions.add(categorySubscription);
      }
    );

    this.subscriptions.add(subscription);
  }

  removeCategoryFromList(categoryId: number): void {
    const index = this.categories.findIndex(
      (category) => category.id === categoryId
    );
    if (index !== -1) {
      this.categories.splice(index, 1);
      this.filteredCategories.splice(index, 1);
      this.deleteCategoryOnServer(categoryId);
    }
  }

  deleteCategoryOnServer(categoryId: number): void {
    this.categoryService.deleteData(categoryId).subscribe({
      next: () => {
        console.log(`Kategorie mit ID ${categoryId} erfolgreich gelöscht.`);
        this.infoBoxService.setInfoBoxStatus(false);
      },
      error: (err) => console.error('Fehler beim Löschen der Kategorie:', err),
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const dropdown = document.querySelector('.categories-wrapper');
    const inputField = document.querySelector('.search-category-input');
    const contactList = document.querySelector('.categories-list');

    if (
      dropdown &&
      !dropdown.contains(event.target as Node) &&
      inputField &&
      !inputField.contains(event.target as Node) &&
      contactList &&
      !contactList.contains(event.target as Node)
    ) {
      this.isCategoriesListVisible = false;
      this.searchTerm = '';
      this.filterCategories();
    }
  }

  filterCategories(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredCategories = this.categories.filter((category) =>
      category.name.toLowerCase().includes(term)
    );
  }

  createRandomColor(): string {
    return this.randomColorService.getRandomColor();
  }

  getUpdatedWarningBoxStatus(): void {
    const subscription = this.infoBoxService.infoBoxStatus$.subscribe(
      (status) => {
        this.isWarningMessageVisible = status;
      }
    );
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
