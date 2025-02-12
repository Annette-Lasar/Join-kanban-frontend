import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { InfoComponent } from '../../shared/components/info/info.component';
import { OutsideClickDirective } from '../../shared/directives/outside-click.directive';
import { ContactStatusService } from '../../shared/services/contact-status.service';
import { ButtonPropertyService } from '../../shared/services/button-propertys.service';
import { BoardStatusService } from '../../shared/services/board-status.service';
import { TaskService } from '../../shared/services/task.service';
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
    CardDetailComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];
  contacts: Contact[] = [];
  boards: Board[] = [];
  isFocused = false;
  isContainerVisible = false;
  searchTerm: string = '';
  message: string = '';
  // selectedTask: Task | null = null;
  selectedTask: Task | null = {
    id: 1,
    title: "Test Task",
    description: "This is a test task to style the detail view.",
    priority: "low",
    due_date: "2025-02-12",
    contacts: [
      {
        id: '1',
        name: "Bilbo Beutlin",
        first_name: "Bilbo",
        last_name: "Beutlin",
        email: "beutlin@hobbingen.com",
        phone_number: "12345538384",
        color: "#AE3294",
        created_by: 3
      },
      {
        id: '2',
        name: "Ronald Weasley",
        first_name: "Ronald",
        last_name: "Weasley",
        email: "ronald-weasley@hogwarts.com",
        phone_number: "39938294992",
        color: "#482d10",
        created_by: 3
      },
      {
        id: '3',
        name: "Albus Dumbledore",
        first_name: "Albus",
        last_name: "Dumbledore",
        email: "albus-brian-dumbledore@hogwarts.com",
        phone_number: "04827849273",
        color: "#a4835d",
        created_by: 3
      }
    ],
    category: {
      id: 1,
      name: "Technical Task",
      color: "#1FD7C9",
      color_brightness: true,
      created_by: null
    },
    subtasks: [
      { id: 1, title: "Subtask 1", checked_status: false },
      { id: 2, title: "Subtask 2", checked_status: true }
    ],
    status: "inProgress",
    board: 1,
    created_by: 3,
    board_list: {
      id: 1,
      name: "toDo"
    }
  };

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private contactStatusService: ContactStatusService,
    private buttonPropertyService: ButtonPropertyService,
    private boardStatusService: BoardStatusService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private boardService: BoardService,
    private textFormatterService: TextFormatterService
  ) {}

  ngOnInit(): void {
    this.getUpdatedBoardSuccessStatus();
    this.getUpdatedMessage();
    this.loadTasks();
    this.loadCategories();
    this.loadContacts();
    this.loadBoards();
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
}
