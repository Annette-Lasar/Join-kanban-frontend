import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InfoComponent } from '../../shared/components/info/info.component';
import { AddTaskContentComponent } from '../../shared/components/add-task-content/add-task-content.component';
import { OutsideClickDirective } from '../../shared/directives/outside-click.directive';
import { ButtonPropertyService } from '../../shared/services/button-propertys.service';
import { BoardStatusService } from '../../shared/services/board-status.service';
import { ActionService } from '../../shared/services/action.service';
import { TaskService } from '../../shared/services/task.service';
import { TaskCreationService } from '../../shared/services/task-creation.service';
import { CategoryService } from '../../shared/services/category.service';
import { ContactService } from '../../shared/services/contact.service';
import { BoardService } from '../../shared/services/board.service';
import { BoardListService } from '../../shared/services/board-list.service';
import { TextFormatterService } from '../../shared/services/text-formatter.service';
import { Task } from '../../shared/interfaces/task.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { Contact } from '../../shared/interfaces/contact.interface';
import { Board } from '../../shared/interfaces/board.interface';
import { BoardList } from '../../shared/interfaces/board-list.interface';
import { TaskCardComponent } from './task-card/task-card.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import {
  DragDropModule,
  CdkDragDrop,
  CdkDropList,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    AddTaskContentComponent,
    InfoComponent,
    OutsideClickDirective,
    TaskCardComponent,
    CardDetailComponent,
    DragDropModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  tasksByBoardList: { [key: string]: Task[] } = {};
  filteredTasksByBoardList: { [key: string]: Task[] } = {};
  categories: Category[] = [];
  contacts: Contact[] = [];
  boards: Board[] = [];
  isFocused = false;
  isContainerVisible = false;
  searchTerm: string = '';
  message: string = '';
  isTaskDetailVisible: boolean = false;
  selectedTask: Task | null = null;
  isDesktop: boolean = false;
  isAddTaskOverlayVisible: boolean = false; // später auf false setzen;
  highlightedList: string | null = null;
  private resizeObserver!: ResizeObserver;
  connectedDropLists = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
  currentAddTaskList: string = 'toDo';

  private subscriptions = new Subscription();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private buttonPropertyService: ButtonPropertyService,
    private boardService: BoardService,
    private boardListService: BoardListService,
    private boardStatusService: BoardStatusService,
    private taskService: TaskService,
    private taskCreationService: TaskCreationService,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private textFormatterService: TextFormatterService,
    private actionService: ActionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUpdatedBoardSuccessStatus();
    this.getUpdatedMessage();
    this.loadBoards();
    this.loadTasks();
    this.loadCategories();
    this.loadContacts();
    this.initializeResizeObserver();
    this.fetchBoardListsFromServer();
    this.getUpdatedTasksSubject();
    this.getUpdatedIsTaskDetailVisibleStatus();
    this.subscribeToTaskDetailEventAndResetSelectedTask();
    this.subscribeToUpdatedTasksByBoardList();
    this.subscribeToOpenAddTaskOverlayEvent();
    this.subscribeToCloseAddTaskOverlayEvent();
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
      this.categorizeTasksByBoardList();
      this.filterTasks();
    });
    this.subscriptions.add(subscription);
  }

  subscribeToUpdatedTasksByBoardList(): void {
    const subscription = this.taskService.tasks$.subscribe((tasks) => {
      this.tasksByBoardList = this.taskService.getTasksByBoardList(tasks);
      this.filterTasks();
    });
    this.subscriptions.add(subscription);
  }

  /*   loadBoards(): void {
    this.boardService.fetchData().subscribe({
      next: () => {
        this.boardService.boards$.subscribe({
          next: (boards) => {
            this.boards = boards;
            console.log('Boards auf dem Board:', this.boards);
          },
          error: (err) => console.error('Fehler beim Abrufen der Boards:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Boards:', err),
    });
  } */

  loadBoards(): void {
    this.boardService.fetchData().subscribe({
      next: () => {
        this.boardService.boards$.subscribe({
          next: (boards) => {
            this.boards = boards;
            console.log('Boards auf dem Board:', this.boards);

            // Direkt prüfen, ob board_lists vorhanden und korrekt sind
            this.boards.forEach((board) => {
              console.log('Board Lists:', board.board_lists);
            });
          },
          error: (err) => console.error('Fehler beim Abrufen der Boards:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Boards:', err),
    });
  }

  fetchBoardListsFromServer(): void {
    this.boardListService.fetchBoardLists();
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

  initializeResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.isDesktop = window.innerWidth > 1024;
      this.cdr.detectChanges();
    });
    this.resizeObserver.observe(document.body);
    this.isDesktop = window.innerWidth > 1024;
  }

  private categorizeTasksByBoardList(): void {
    this.tasksByBoardList = {};

    this.filteredTasks.forEach((task) => {
      const listName = task.board_list?.name || '';
      if (!this.tasksByBoardList[listName]) {
        this.tasksByBoardList[listName] = [];
      }
      this.tasksByBoardList[listName].push(task);
    });
  }

  onDragEntered(listName: string): void {
    this.highlightedList = listName;
  }

  onDragExited(listName: string): void {
    if (this.highlightedList === listName) {
      this.highlightedList = null;
    }
  }

  /* onTaskDrop({
    item,
    container,
    previousContainer,
  }: CdkDragDrop<Task[]>): void {
    const movedTask = item.data as Task;
    const targetList = this.boards[0].board_lists.find(
      (list) => list.name === container.id
    );
    if (!targetList) return;

    this.optimisticUIUpdate(
      movedTask,
      previousContainer,
      container,
      targetList
    );
    this.updateTaskInBackend(
      movedTask,
      targetList,
      container,
      previousContainer
    );

    this.highlightedList = null;
  } */

  onTaskDrop({
    item,
    container,
    previousContainer,
  }: CdkDragDrop<Task[]>): void {
    const movedTask = item.data as Task;

    // Warten, bis die Boards geladen sind
    if (!this.boards || this.boards.length === 0) {
      console.error('Boards sind noch nicht geladen!');
      return;
    }

    const targetBoard = this.boards[0];

    if (!targetBoard.board_lists || targetBoard.board_lists.length === 0) {
      console.error('Board Lists sind noch nicht geladen!');
      return;
    }

    const targetList = targetBoard.board_lists.find(
      (list) => list.name === container.id
    );

    if (!targetList) {
      console.error('Board List nicht gefunden für:', container.id);
      return;
    }

    this.optimisticUIUpdate(
      movedTask,
      previousContainer,
      container,
      targetList
    );
    this.updateTaskInBackend(
      movedTask,
      targetList,
      container,
      previousContainer
    );

    this.highlightedList = null;
  }

  private optimisticUIUpdate(
    movedTask: Task,
    previousContainer: CdkDropList<Task[]>,
    container: CdkDropList<Task[]>,
    targetList: BoardList
  ): void {
    if (previousContainer !== container) {
      transferArrayItem(
        previousContainer.data,
        container.data,
        previousContainer.data.indexOf(movedTask),
        container.data.length
      );

      this.cdr.detectChanges();
    }

    this.taskService.updateGeneralTaskState({
      id: movedTask.id,
      board_list_id: targetList.id,
    });
  }

  private updateTaskInBackend(
    movedTask: Task,
    targetList: BoardList,
    container: CdkDropList<Task[]>,
    previousContainer: CdkDropList<Task[]>
  ): void {
    const updatedTask: Task = {
      ...movedTask,
      board_list_id: targetList.id,
      contact_ids: movedTask.contacts.map((c) => c.id!),
      category_id: movedTask.category.id,
    };

    this.taskService.updateData(movedTask.id!, updatedTask).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Fehler beim Aktualisieren des Tasks:', err);

        transferArrayItem(
          container.data,
          previousContainer.data,
          container.data.indexOf(movedTask),
          previousContainer.data.length
        );

        this.taskService.updateGeneralTaskState({
          id: movedTask.id,
          board_list_id: movedTask.board_list_id,
        });

        this.cdr.detectChanges();
        this.cdr.markForCheck();
      },
    });
  }

  subscribeToOpenAddTaskOverlayEvent(): void {
    const subscription = this.actionService.openAddTaskOverlayEvent.subscribe(
      (list) => {
        this.boardStatusService.setBoardTaskOverlayOpenStatus(true);
        this.subscribeToBoardTaskOverlayOpenStatus();
        this.currentAddTaskList = list || 'toDo';
        console.log('Zu dieser Liste hinzufügen: ', this.currentAddTaskList);
      }
    );
    this.subscriptions.add(subscription);
  }

  subscribeToBoardTaskOverlayOpenStatus(): void {
    const subscription =
      this.boardStatusService.boardTaskOverlayOpenStatus$.subscribe(
        (status) => {
          this.isAddTaskOverlayVisible = status;
          console.log('Overlay: ', this.isAddTaskOverlayVisible);
        }
      );
    this.subscriptions.add(subscription);
  }

  subscribeToCloseAddTaskOverlayEvent(): void {
    const subscription = this.actionService.closeAddTaskOverlayEvent.subscribe(
      () => {
        this.boardStatusService.setBoardTaskOverlayOpenStatus(false);
        this.currentAddTaskList = 'toDo';
      }
    );

    this.subscriptions.add(subscription);
  }

  filterTasks(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredTasks = this.taskService
      .getTasks()
      .filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
      );
    this.filteredTasksByBoardList = this.taskService.getTasksByBoardList(
      this.filteredTasks
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
      this.buttonPropertyService.setIsTaskDetailVisibleStatusSubject(false);
    });
    this.subscriptions.add(subscription);
  }

  setBoardSuccessStatus(newStatus: boolean): void {
    this.boardStatusService.setBoardSuccessStatus(newStatus);
  }

  /*   onSubmit(): void {
    const taskData = this.taskCreationService.getCurrentTask();
    console.log('Task Data:', taskData);

    console.log('Kategorie beim Submit:', this.taskService.getSelectedCategory());

    if (!taskData.title?.trim()) {
      console.error('Fehler: Titel fehlt!');
      return;
    }

    console.log('Huhu! Aktuelle Liste für neue Task: ', this.currentAddTaskList);
    this.taskCreationService.startTaskCreation(this.currentAddTaskList, taskData);
  } */

  onSubmit(): void {
    const taskData = this.taskCreationService.getCurrentTask();
    console.log('Task Data:', taskData);

    if (!taskData.title?.trim()) {
      console.error('Fehler: Titel fehlt!');
      return;
    }

    // Überprüfen, ob die aktuelle Liste existiert
    const boardListId = this.boardListService.getBoardListIdByName(
      this.currentAddTaskList
    );

    if (!boardListId) {
      console.error(
        'Board List ID nicht gefunden für:',
        this.currentAddTaskList
      );
      return;
    }

    console.log('Huhu! Aktuelle Liste für neue Task:', this.currentAddTaskList);

    this.taskCreationService.startTaskCreation(
      this.currentAddTaskList,
      taskData
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
