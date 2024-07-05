import { Component } from '@angular/core';
import { HeaderContentComponent } from '../shared/components/header-content/header-content.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { AddTaskContentComponent } from '../shared/components/add-task-content/add-task-content.component';

@Component({
  selector: 'join-add-task',
  standalone: true,
  imports: [HeaderContentComponent, NavbarComponent, AddTaskContentComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

}
