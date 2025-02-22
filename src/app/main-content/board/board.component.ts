import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { InfoComponent } from '../../shared/components/info/info.component';
import { OutsideClickDirective } from '../../shared/directives/outside-click.directive';
import { ButtonPropertyService } from '../../shared/services/button-propertys.service';
import { BoardStatusService } from '../../shared/services/board-status.service';
import { ActionService } from '../../shared/services/action.service';
import { TaskService } from '../../shared/services/task.service';
import { TaskStatusService } from '../../shared/services/task-status.service';
import { CategoryService } from '../../shared/services/category.service';
import { ContactService } from '../../shared/services/contact.service';
import { BoardService } from '../../shared/services/board.service';
import { TextFormatterService } from '../../shared/services/text-formatter.service';
import { Task } from '../../shared/interfaces/task.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { Contact } from '../../shared/interfaces/contact.interface';
import { Board } from '../../shared/interfaces/board.interface';
import { TaskCardComponent } from './task-card/task-card.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    RouterLink,
    InfoComponent,
    OutsideClickDirective,
    TaskCardComponent,
    CardDetailComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];
  contacts: Contact[] = [];
  boards: Board[] = [];
  isFocused = false;
  isContainerVisible = false;
  searchTerm: string = '';
  message: string = '';
  isTaskDetailVisible: boolean = false;
  selectedTask: Task | null = null;

  private subscriptions = new Subscription();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private buttonPropertyService: ButtonPropertyService,
    private boardStatusService: BoardStatusService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private boardService: BoardService,
    private textFormatterService: TextFormatterService,
    private actionService: ActionService,
    private taskStatusService: TaskStatusService
  ) {}

  ngOnInit(): void {
    this.getUpdatedBoardSuccessStatus();
    this.getUpdatedMessage();
    this.loadBoards();
    this.loadTasks();
    this.loadCategories();
    this.loadContacts();
    this.getUpdatedTasksSubject();
    this.getUpdatedIsTaskDetailVisibleStatus();
    this.subscribeToTaskDetailEventAndResetSelectedTask();
  }

  getUpdatedBoardSuccessStatus(): void {
    this.boardStatusService.boardSuccessStatus$.subscribe((status) => {
      this.isContainerVisible = status;
    });
  }

  getUpdatedMessage(): void {
    this.buttonPropertyService.successMessage$.subscribe((message) => {
      if (message) {
        this.message = message;
      }
    });
  }

  getUpdatedIsTaskDetailVisibleStatus(): void {
    this.buttonPropertyService.isTaskDetailVisibleStatusSubject$.subscribe(
      (status) => {
        this.isTaskDetailVisible = status;
      }
    );
  }

  getUpdatedTasksSubject(): void {
    const subscription = this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.filteredTasks = [...tasks];
      this.filterTasks();
    });
    this.subscriptions.add(subscription);
  }

  loadBoards(): void {
    this.boardService.fetchData().subscribe({
      next: () => {
        this.boardService.boards$.subscribe({
          next: (boards) => {
            this.boards = boards;
            console.log('Boards in AddTask:', this.boards);
          },
          error: (err) => console.error('Fehler beim Abrufen der Boards:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Boards:', err),
    });
  }

  loadTasks(): void {
    this.taskService.fetchData().subscribe({
      next: () => {
        this.taskService.tasks$.subscribe({
          next: (tasks) => {
            this.tasks = tasks;
            this.filterTasks();
            console.log('Tasks auf dem Board:', this.tasks);
          },
          error: (err) =>
            console.error('Fehler beim Abrufen der Aufgaben:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Aufgaben:', err),
    });
  }

  loadCategories(): void {
    this.categoryService.fetchData().subscribe({
      next: () => {
        this.categoryService.categories$.subscribe({
          next: (categories) => {
            this.categories = categories;
            console.log('Kategorien auf dem Board:', this.categories);
          },
          error: (err) =>
            console.error('Fehler beim Abrufen der Kategorien:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Kategorien:', err),
    });
  }

  loadContacts(): void {
    this.contactService.fetchData().subscribe({
      next: () => {
        this.contactService.contacts$.subscribe({
          next: (contacts) => {
            this.contacts = contacts;
            console.log('Kontakte auf dem Board:', this.contacts);
          },
          error: (err) =>
            console.error('Fehler beim Abrufen der Kontakte:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Kontakte:', err),
    });
  }

  filterTasks(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredTasks = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
    );
  }

  isSearchActive(): boolean {
    return (
      this.searchTerm.trim() !== '' &&
      this.filteredTasks.length !== this.tasks.length
    );
  }

  getMatchText(): string {
    return this.filteredTasks.length === 1
      ? `${this.filteredTasks.length} match`
      : `${this.filteredTasks.length} matches`;
  }

  leaveSearchInputFocus() {
    this.toggleSearchIcon(false);
  }

  toggleSearchIcon(focus: boolean): void {
    this.isFocused = focus;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterTasks();
  }

  toggleContainerVisibility(newMessage: string) {
    this.message = newMessage;
    this.isContainerVisible = !this.isContainerVisible;
    this.boardStatusService.setBoardSuccessStatus(this.isContainerVisible);
  }

  hideContainer() {
    this.isContainerVisible = false;
  }

  getFormattedBoardListName(boardListName: string, action: string): string {
    if (action === 'capitalized') {
      return this.textFormatterService.formatBoardListNameCapitalized(
        boardListName
      );
    } else if (action === 'lowercased') {
      return this.textFormatterService.formatBoardListNameLowercased(
        boardListName
      );
    } else {
      return boardListName;
    }
  }

  openCardDetailView(id: number): void {
    this.selectedTask =
      this.tasks.find((currentTask) => currentTask.id === id) || null;
    if (this.selectedTask) {
      this.buttonPropertyService.setIsTaskDetailVisibleStatusSubject(true);
    }
  }

  subscribeToTaskDetailEventAndResetSelectedTask(): void {
    const subscription = this.actionService.taskDetailEvent.subscribe(() => {
      this.selectedTask = null;
    });
    this.subscriptions.add(subscription);
  }

/*   listenToOriginalTaskState(): void {
    const subscription =
      this.taskStatusService.originalTaskStateSubject$.subscribe(
        (originalTask) => {
          if (!this.selectedTask) return;
          console.log('Orginialzustand einer Aufgabe geladen: ', originalTask);
        }
      );
    this.subscriptions.add(subscription);
  } */

/*   cancelEdit(): void {
    const subscription = this.actionService.closeEditModeEvent.subscribe(() => {
      const originalTask = this.taskStatusService.getOriginalTaskStatus();
      if (originalTask) {
        this.selectedTask = JSON.parse(JSON.stringify(originalTask));
        console.log('Alte Aufgabe: ', this.selectedTask);
        console.log('Änderungen verworfen, O-Zustand wiederhergestellt.');
      }
    });
    this.subscriptions.add(subscription);
  } */

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
