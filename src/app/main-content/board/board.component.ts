import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { InfoComponent } from '../../shared/components/info/info.component';
import { OutsideClickDirective } from '../../shared/directives/outside-click.directive';
import { ContactStatusService } from '../../shared/services/contact-status.service';
import { ButtonPropertyService } from '../../shared/services/button-propertys.service';
import { BoardStatusService } from '../../shared/services/board-status.service';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../shared/interfaces/task.interface';


@Component({
  selector: 'join-board',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink,
    InfoComponent,
    OutsideClickDirective,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  isFocused = false;
  isContainerVisible = false;
  message: string = '';
  allTasks: Task[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private contactStatusService: ContactStatusService,
    private buttonPropertyService: ButtonPropertyService,
    private boardStatusService: BoardStatusService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.getUpdatedBoardSuccessStatus();
    this.getUpdatedMessage();
    this.taskService.fetchTasks().subscribe();
    this.getUpdatedTasks();
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

  getUpdatedTasks(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      if (tasks) {
        this.allTasks = tasks;
        console.log('Alle Aufgaben: ', this.allTasks);
      }
    })
  }

  leaveSearchInputFocus() {
    this.toggleSearchIcon(false);
    this.clearSearch();
  }

  toggleSearchIcon(focus: boolean): void {
    this.isFocused = focus;
  }

  clearSearch(): void {
    this.searchInput.nativeElement.value = '';
  }

  toggleContainerVisibility(newMessage: string) {
    this.message = newMessage;
    this.isContainerVisible = !this.isContainerVisible;
    this.boardStatusService.setBoardSuccessStatus(this.isContainerVisible);
  }

  hideContainer() {
    this.isContainerVisible = false;
  }
}
