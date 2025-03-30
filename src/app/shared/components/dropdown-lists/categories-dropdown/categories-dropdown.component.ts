import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../interfaces/task.interface';
import { Category } from '../../../interfaces/category.interface';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { RandomColorService } from '../../../services/random-color.service';
import { ButtonComponent } from '../../button/button.component';
import { InfoBoxService } from '../../../services/info-box.service';
import { ActionService } from '../../../services/action.service';
import { TaskService } from '../../../services/task.service';
import { ColorBrightnessService } from '../../../services/color-brightness.service';
import { Subscription } from 'rxjs';

type CategoryField = 'color' | 'name';
type NewCategoryAction = 'show' | 'hide';

@Component({
  selector: 'join-categories-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './categories-dropdown.component.html',
  styleUrl: './categories-dropdown.component.scss',
})
export class CategoriesDropdownComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() categories: Category[] = [];
  @Input() isNewTask: boolean = false;
  filteredCategories: Category[] = [];
  deletedCategoryIds: number[] = [];
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
  categoryTouched: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private randomColorService: RandomColorService,
    private infoBoxService: InfoBoxService,
    private actionService: ActionService,
    private taskService: TaskService,
    private colorBrightnessService: ColorBrightnessService
  ) {}

  ngOnInit(): void {
    this.initializeSelectedCategory();
    this.getPrepareDeleteCategorySubjectFromService();
    this.subscribeToDeleteCategorySubject();
    this.getUpdatedWarningBoxStatus();
    this.completeFilteredCategories();
    this.subscribeToCategoryValidation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeSelectedCategory(): void {
    const subscription = this.taskService.selectedCategorySubject$.subscribe(
      (category) => {
        this.selectedCategory = category;
      }
    );

    this.subscriptions.add(subscription);
  }

  completeFilteredCategories(): void {
    this.filteredCategories = [...this.categories];
  }

  toggleCategoriesList(event: Event) {
    this.taskService.setCategoryTouched(true);
    this.isCategoriesListVisible = !this.isCategoriesListVisible;
    event.stopPropagation();
    this.filterCategories();
  }

  setSelectedCategory(newCategory: Category): void {
    this.selectedCategory = newCategory;
    this.taskService.setSelectedCategory(newCategory);
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

  subscribeToCategoryValidation(): void {
    const subscription = this.taskService.categoryTouched$.subscribe(
      (touched) => {
        this.categoryTouched = touched;
      }
    );
    this.subscriptions.add(subscription);
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

    updatedCategory.color_brightness =
      this.colorBrightnessService.isColorBright(updatedCategory.color);
    this.taskService.updateCategoryInTasks(updatedCategory);

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
        }
      }
    );
    this.subscriptions.add(subscription);
  }

  subscribeToDeleteCategorySubject(): void {
    const subscription = this.actionService.deleteCategoryEvent.subscribe(
      () => {
        const categorySubscription =
          this.actionService.deleteCategorySubject$.subscribe((categoryId) => {
            if (categoryId !== null) {
              this.markCategoryForDeletion(categoryId);
            }
          });

        this.subscriptions.add(categorySubscription);
      }
    );

    this.subscriptions.add(subscription);
  }

  markCategoryForDeletion(categoryId: number): void {
    const index = this.categories.findIndex(
      (category) => category.id === categoryId
    );
    if (index !== -1) {
      this.categories.splice(index, 1);
      this.filteredCategories.splice(index, 1);
      this.deletedCategoryIds.push(categoryId);
      this.infoBoxService.setInfoBoxStatus(false);
      if (this.selectedCategory?.id === categoryId) {
        this.selectedCategory = null;
      }
      this.infoBoxService.setInfoBox({ isVisible: false });
    }
  }

  deleteMarkedCategories(): void {
    const failedDeletes: number[] = [];

    this.deletedCategoryIds.forEach((categoryId) => {
      this.categoryService.deleteData(categoryId).subscribe({
        next: () => {
          this.infoBoxService.setInfoBoxStatus(false);
        },
        error: (err) => {
          console.error(
            `Fehler beim Löschen der Kategorie ${categoryId}: `,
            err
          );
          failedDeletes.push(categoryId);
        },
        complete: () => {
          this.deletedCategoryIds = this.deletedCategoryIds.filter(
            (id) => !failedDeletes.includes(id)
          );
        },
      });
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
}
