import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AddTaskContentComponent } from '../../shared/components/add-task-content/add-task-content.component';
import { DataLoaderService } from '../../shared/services/data-loader.service';
import { ButtonPropertyService } from '../../shared/services/button-propertys.service';
import { BoardStatusService } from '../../shared/services/board-status.service';
import { ActionService } from '../../shared/services/action.service';
import { TaskService } from '../../shared/services/task.service';
import { TaskCreationService } from '../../shared/services/task-creation.service';
import { BoardListService } from '../../shared/services/board-list.service';
import { InfoBoxService } from '../../shared/services/info-box.service';
import { TextFormatterService } from '../../shared/services/text-formatter.service';
import { Task } from '../../shared/interfaces/task.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { Contact } from '../../shared/interfaces/contact.interface';
import { Board } from '../../shared/interfaces/board.interface';
import { BoardList } from '../../shared/interfaces/board-list.interface';
import { InfoMessage } from '../../shared/interfaces/info-message.interface';
import { TaskCardComponent } from './task-card/task-card.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import {
  DragDropModule,
  CdkDragDrop,
  CdkDropList,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'join-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    AddTaskContentComponent,
    TaskCardComponent,
    CardDetailComponent,
    DragDropModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  tasksByBoardList: { [key: string]: Task[] } = {};
  filteredTasksByBoardList: { [key: string]: Task[] } = {};
  categories: Category[] = [];
  contacts: Contact[] = [];
  boards: Board[] = [];
  connectedDropLists = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
  currentAddTaskList: string = 'toDo';

  isFocused = false;
  infoBoxProperties: InfoMessage | null = null;
  isTaskDetailVisible: boolean = false;
  isDesktop: boolean = false;
  isAddTaskOverlayVisible: boolean = false;
  highlightedList: string | null = null;
  selectedTask: Task | null = null;
  searchTerm: string = '';
  message: string = '';

  private resizeObserver!: ResizeObserver;
  private subscriptions = new Subscription();

  constructor(
    private dataLoaderService: DataLoaderService,
    private buttonPropertyService: ButtonPropertyService,
    private infoBoxService: InfoBoxService,
    private boardListService: BoardListService,
    private boardStatusService: BoardStatusService,
    private taskService: TaskService,
    private taskCreationService: TaskCreationService,
    private textFormatterService: TextFormatterService,
    private actionService: ActionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllData();
    this.getUpdatedMessage();
    this.initializeResizeObserver();
    this.fetchBoardListsFromServer();
    this.subscribeToTasks();
    this.getUpdatedIsTaskDetailVisibleStatus();
    this.subscribeToTaskDetailEventAndResetSelectedTask();
    this.subscribeToOpenAddTaskOverlayEvent();
    this.subscribeToCloseAddTaskOverlayEvent();
    this.subscribeToInfoBoxSubject();
    this.subscribeToResetNewTaskEvent();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUpdatedMessage(): void {
    this.infoBoxService.successMessage$.subscribe((message) => {
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



  subscribeToTasks(): void {
    const subscription = this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      // this.filteredTasks = [...tasks];
      const newFiltered = [...tasks];
      if (this.filteredTasks.length === 0 ||
        !this.arraysAreEqual(this.filteredTasks, tasks)) {
        this.filteredTasks = [...tasks];
      }
      this.tasksByBoardList = this.taskService.getTasksByBoardList(tasks);
      this.filterTasks();
    });
    this.subscriptions.add(subscription);
  }


  private loadAllData(): void {
    this.subscriptions.add(
      forkJoin({
        boards: this.dataLoaderService.loadBoards(),
        tasks: this.dataLoaderService.loadTasks(),
        categories: this.dataLoaderService.loadCategories(),
        contacts: this.dataLoaderService.loadContacts(),
      }).subscribe({
        next: ({ boards, tasks, categories, contacts }) => {
          this.boards = boards;
          this.tasks = tasks;
          this.categories = categories;
          this.contacts = contacts;
          this.filterTasks();
        },
        error: (err) => console.error('Error loading data: ', err),
      })
    );
  }

  fetchBoardListsFromServer(): void {
    this.boardListService.fetchBoardLists();
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

  onTaskDrop({
    item,
    container,
    previousContainer,
  }: CdkDragDrop<Task[]>): void {
    const movedTask = item.data as Task;

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
    this.updateTaskInBackend(movedTask, targetList);

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
    }
  
    this.taskService.updateGeneralTaskState({
      id: movedTask.id,
      board_list_id: targetList.id,
    });
  
    this.cdr.detectChanges();
  }
  

  logRender(title: string): string {
    console.log('Render Task:', title);
    return '';
  }

  private updateTaskInBackend(movedTask: Task, targetList: BoardList): void {
    const updatedTask: Task = {
      ...movedTask,
      board_list_id: targetList.id,
      contact_ids: movedTask.contacts.map((c) => c.id!),
      category_id: movedTask.category.id,
    };

    this.taskService.updateData(movedTask.id!, updatedTask).subscribe({
      next: () => {},
      error: () => {},
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

  subscribeToResetNewTaskEvent(): void {
    const subscription = this.actionService.resetNewTaskEvent.subscribe(() => {
      this.resetNewTask();
    });
    this.subscriptions.add(subscription);
  }

  resetNewTask(): void {
    this.taskCreationService.clearNewTask();
    this.taskService.setSelectedCategory(null);
    this.taskService.clearAssignedContacts();
    this.taskService.setAssignedSubtasks([]);
  }

  /*   filterTasks(): void {
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
  } */

  /* filterTasks(): void {
    const term = this.searchTerm.toLowerCase().trim();

    const filteredTasks = this.taskService
      .getTasks()
      .filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
      );

    const newFilteredByList =
      this.taskService.getTasksByBoardList(filteredTasks);
    const updated: { [key: string]: Task[] } = {};

    for (const key of this.connectedDropLists) {
      const newList = newFilteredByList[key] || [];
      const oldList = this.filteredTasksByBoardList[key];

      const isNew = !oldList;

      const hasChanged =
        isNew ||
        oldList.length !== newList.length ||
        oldList.some((task, i) => task.id !== newList[i]?.id);

      updated[key] = hasChanged ? newList : oldList;
    }

    this.filteredTasksByBoardList = updated;
  } */

    filterTasks(): void {
      const term = this.searchTerm.toLowerCase().trim();
      const filteredTasks = this.taskService.getTasks().filter((task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
      this.filteredTasks = filteredTasks;
    
      const newFilteredByList = this.taskService.getTasksByBoardList(filteredTasks);
    
      let changed = false;
      const updated: { [key: string]: Task[] } = { ...this.filteredTasksByBoardList };
    
      for (const key of this.connectedDropLists) {
        const newList = newFilteredByList[key] || [];
        const oldList = this.filteredTasksByBoardList[key] || [];
    
        const sameLength = oldList.length === newList.length;
        const sameContent = sameLength && oldList.every((t, i) => t.id === newList[i].id);
    
        if (!sameContent) {
          updated[key] = newList;
          changed = true;
        }
      }
    
      if (changed) {
        this.filteredTasksByBoardList = updated;
      }
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
    /* this.message = newMessage;
    this.isInfoContainerVisible = !this.isInfoContainerVisible;
    this.boardStatusService.setBoardSuccessStatus(this.isInfoContainerVisible); */
  }

  hideContainer() {
    // this.isInfoContainerVisible = false;
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

  subscribeToInfoBoxSubject(): void {
    this.infoBoxService.infoBoxSubject$.subscribe((info) => {
      this.infoBoxProperties = info;
    });
  }

  onSubmit(): void {
    const taskData = this.taskCreationService.getCurrentTask();
    console.log('Task Data:', taskData);

    if (!taskData.title?.trim()) {
      console.error('Fehler: Titel fehlt!');
      return;
    }

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

    this.taskCreationService.startTaskCreation(
      this.currentAddTaskList,
      taskData
    );
  }

  private arraysAreEqual(a: Task[], b: Task[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((task, i) => task.id === b[i]?.id);
  }
}
