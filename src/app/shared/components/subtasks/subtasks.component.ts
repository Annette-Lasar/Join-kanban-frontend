import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subtask, Task, SubtaskUI } from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { Subscription } from 'rxjs';
import { ActionService } from '../../services/action.service';
import { TaskService } from '../../services/task.service';
import { ButtonPropertyService } from '../../services/button-propertys.service';

@Component({
  selector: 'join-subtasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './subtasks.component.html',
  styleUrl: './subtasks.component.scss',
})
export class SubtasksComponent implements OnInit, OnDestroy, OnChanges {
  @Input() task!: Task;
  @Input() isNewTask: boolean = false;
  
  get subtasks(): SubtaskUI[] {
    return (this.task?.subtasks ?? []) as SubtaskUI[];
  }

  newSubtasks: SubtaskUI[] = [];
  isCancelAddSubtaskVisible: boolean = false;
  subtaskTitle: string = '';
  editedSubtaskTitle: string = '';
  editSubtask: boolean = false;
  isMouseDown: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private actionService: ActionService,
    private buttonPropertyService: ButtonPropertyService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.initializeSubtasks();
    this.subscribeToAssignedSubtasks();
    this.subscribeToToggleAddSubtaskBox();
    this.listenToMouseDown();
    this.listenToMouseUp();
    this.subscribeToDeleteSubtask();
    this.subscribeToEditSubtask();
    this.subscribeToOpenEditSubtaskBox();
  }

  ngOnChanges(): void {
    this.initializeSubtasks();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeSubtasks(): void {
    if (this.isNewTask) {
      this.newSubtasks = [];
      this.taskService.setAssignedSubtasks([]);
    } else if (this.task) {
      this.newSubtasks = this.task.subtasks;
      this.taskService.setAssignedSubtasks(this.newSubtasks);
    } else {
      console.error('Fehler: Weder bestehende noch neue Aufgabe erkannt');
      this.newSubtasks = [];
    }
  }

  subscribeToAssignedSubtasks(): void {
    const subscription = this.taskService.assignedSubtasksSubject$.subscribe(
      (assignedSubtasks) => {
        this.newSubtasks = assignedSubtasks.map((subtask) => ({
          ...subtask,
          isEditing: false,
        }));
      }
    );
    this.subscriptions.add(subscription);
  }

  subscribeToToggleAddSubtaskBox(): void {
    const subscription = this.actionService.addSubtaskEvent.subscribe(
      ({ message, id, event }) => {
        console.log('event: ', event);
        this.handleSubtaskAction(message);
        this.subscribeToAddSubtaskBox();
      }
    );
    this.subscriptions.add(subscription);
  }

  listenToMouseDown(): void {
    document.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
  }

  listenToMouseUp(): void {
    document.addEventListener('mouseup', () => {
      setTimeout(() => {
        this.isMouseDown = false;
      }, 50);
    });
  }

  handleSubtaskAction(message?: string) {
    switch (message) {
      case 'open':
        this.buttonPropertyService.setCancelAddSubtaskvisible(true);
        break;
      case 'cancel':
        this.cancelSubtask();
        this.buttonPropertyService.setCancelAddSubtaskvisible(false);
        break;
      case 'save':
        this.organizeNewSubtaskHandling();
        this.buttonPropertyService.setCancelAddSubtaskvisible(false);
        break;
      default:
        console.log(`Unknown action: ${message}`);
    }
  }

  organizeNewSubtaskHandling() {
    if (this.isNewTask) {
      this.addSubtaskToNewTask();
    } else {
      this.addSubtaskToList();
    }
  }

  subscribeToAddSubtaskBox() {
    const subscription =
      this.buttonPropertyService.isCancelAddSubtaskVisibleSubject$.subscribe(
        (status) => {
          this.isCancelAddSubtaskVisible = status;
        }
      );
    this.subscriptions.add(subscription);
  }

  onFocusSubtaskInput(): void {
    this.buttonPropertyService.setCancelAddSubtaskvisible(true);
    this.subscribeToAddSubtaskBox();
  }

  onBlurSubtaskInput(): void {
    setTimeout(() => {
      if (!this.isMouseDown) {
        this.buttonPropertyService.setCancelAddSubtaskvisible(false);
        this.subscribeToAddSubtaskBox();
      }
    }, 100);
  }

  cancelSubtask(): void {
    this.subtaskTitle = '';
  }

  addSubtaskToNewTask(): void {
    const newSubtask: SubtaskUI = {
      id: undefined,
      tempId: Date.now() + Math.floor(Date.now() + Math.random() * 10),
      title: this.subtaskTitle.trim(),
      checked_status: false,
    };

    if (this.subtaskTitle.trim() !== '') {
      this.newSubtasks.push(newSubtask);
      this.taskService.setAssignedSubtasks(this.newSubtasks);
      this.cancelSubtask();
    }
  }

  addSubtaskToList(): void {
    const newSubtask: Subtask = {
      title: this.subtaskTitle.trim(),
      checked_status: false,
    };
    if (newSubtask.title !== '') {
      this.task.subtasks.push(newSubtask);
      this.taskService.setSubtasks([...this.task.subtasks]);
      this.cancelSubtask();
    } else {
      console.log('Please enter a subtask title.');
    }
  }

  subscribeToDeleteSubtask(): void {
    const subscription = this.actionService.deleteSubtaskEvent.subscribe(
      (id) => {
        if (this.task) {
          this.deleteSubtaskFromList(id);
        } else if (this.isNewTask) {
          this.deleteSubtaskFromNewTask(id);
        } else {
          console.warn('Unknown status: no subtask found for deletion.');
        }
      }
    );
    this.subscriptions.add(subscription);
  }

  deleteSubtaskFromList(id?: number): void {
    const index = this.task.subtasks.findIndex((subtask) => subtask.id === id);
    if (index !== -1) {
      this.task.subtasks.splice(index, 1);
    } else {
      console.log(`Subtask with the ID ${id} was not found.`);
    }
    this.taskService.setSubtasks([...this.task.subtasks]);
  }

  deleteSubtaskFromNewTask(id?: number) {
    const index = this.newSubtasks.findIndex(
      (subtask) => subtask.tempId === id
    );
    if (index !== -1) {
      this.newSubtasks.splice(index, 1);
    } else {
      console.log(`Subtask with the ID ${id} was not found.`);
    }
    this.taskService.setNewSubtasks([...this.newSubtasks]);
  }

  subscribeToOpenEditSubtaskBox(): void {
    const subscription = this.actionService.openEditSubtaskBoxEvent.subscribe(
      (id) => {
        this.buttonPropertyService.setEditSubtaskSubject(true);
        if (this.task) {
          this.startEditingSubtask(id);
        } else if (this.isNewTask) {
          this.startEditingSubtaskInNewTask(id);
        } else {
          console.warn('Unknown status: no subtask available for editing');
        }
      }
    );
    this.subscriptions.add(subscription);
  }

  startEditingSubtask(id?: number): void {
    const subtask = this.subtasks.find((subtask) => subtask.id === id);
    if (subtask) {
      this.editedSubtaskTitle = subtask.title;
      subtask.isEditing = true;
    }
  }

  startEditingSubtaskInNewTask(id?: number) {
    const subtask = this.newSubtasks.find((subtask) => subtask.tempId === id);
    if (subtask) {
      this.editedSubtaskTitle = subtask.title;
      subtask.isEditing = true;
    }
  }

  subscribeToEditSubtask(): void {
    const subscription = this.actionService.saveEditedSubtaskEvent.subscribe(
      (id) => {
        if (this.task) {
          this.editSubtaskInList(id);
        } else if (this.isNewTask) {
          this.editSubtaskInNewTask(id);
        } else {
          console.warn(
            'Unknown status: no edited subtask available for saving.'
          );
        }
      }
    );
    this.subscriptions.add(subscription);
  }

  editSubtaskInList(id?: number): void {
    const subtask = this.subtasks.find((subtask) => subtask.id === id);
    if (!subtask) return;
    if (this.editedSubtaskTitle.trim() === '') {
      this.editedSubtaskTitle = subtask.title;
      subtask.isEditing = false;
    }

    subtask.title = this.editedSubtaskTitle.trim();
    subtask.isEditing = false;

    this.taskService.setSubtasks(
      this.subtasks.map((subtask) => {
        const { isEditing, ...cleanSubtask } = subtask;
        return cleanSubtask;
      })
    );
  }

  editSubtaskInNewTask(id?: number): void {
    const subtask = this.newSubtasks.find((subtask) => subtask.tempId === id);
    if (!subtask) return;
    if (this.editedSubtaskTitle.trim() === '') {
      this.editedSubtaskTitle = subtask.title;
      subtask.isEditing = false;
    }

    subtask.title = this.editedSubtaskTitle.trim();
    subtask.isEditing = false;

    this.taskService.setSubtasks(
      this.subtasks.map((subtask) => {
        const { tempId, isEditing, ...cleanSubtask } = subtask;
        return cleanSubtask;
      })
    );
  }

  cancelEditSubtask(id?: number): void {
    const subtask = this.subtasks.find((subtask) => subtask.id === id);
    if (!subtask) return;
    setTimeout(() => {
      if (!this.isMouseDown) {
        this.editedSubtaskTitle = subtask.title;
        subtask.isEditing = false;
      }
    }, 100);
  }

  getNewSubtaskBoxStatus() {
    const subscription =
      this.buttonPropertyService.isCancelAddSubtaskVisibleSubject$.subscribe(
        (status) => {
          console.log('aktueller Status im Service: ', status);
          this.isCancelAddSubtaskVisible = status;
        }
      );
    this.subscriptions.add(subscription);
  }


}
