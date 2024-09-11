import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AddTaskContentComponent } from '../../shared/components/add-task-content/add-task-content.component';

@Component({
  selector: 'join-add-task',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, AddTaskContentComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {}
