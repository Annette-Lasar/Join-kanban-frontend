import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
export class SubtasksComponent implements OnInit, OnDestroy {
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

  subscriptions = new Subscription();

  constructor(
    private actionService: ActionService,
    private buttonPropertyService: ButtonPropertyService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.subscribeToToggleAddSubtaskBox();
    this.listenToMouseDown();
    this.listenToMouseUp();
    this.subscribeToDeleteSubtask();
    this.subscribeToEditSubtask();
    this.subscribeToOpenEditSubtaskBox();
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
      console.log('Eine ganz neue Subtask erstellen');
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
    const newSubtask: Subtask = {
      id: undefined,
      title: this.subtaskTitle.trim(),
      checked_status: false,
    };

    this.newSubtasks.push(newSubtask);
    this.taskService.setNewSubtasks(this.newSubtasks);
    this.cancelSubtask();
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
        this.deleteSubtaskFromList(id);
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

  subscribeToOpenEditSubtaskBox(): void {
    const subscription = this.actionService.openEditSubtaskBoxEvent.subscribe(
      (id) => {
        this.buttonPropertyService.setEditSubtaskSubject(true);
        this.startEditingSubtask(id);
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

  subscribeToEditSubtask(): void {
    const subscription = this.actionService.saveEditedSubtaskEvent.subscribe(
      (id) => {
        console.log('Ich wurde auch angeklickt!');
        this.editSubtaskInList(id);
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
