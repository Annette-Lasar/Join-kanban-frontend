import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Task } from '../../../../shared/interfaces/task.interface';
import { TextFormatterService } from '../../../../shared/services/text-formatter.service';

@Component({
  selector: 'join-task-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
@Input() task: Task | null = null;
pathPrefix: string = 'assets/icons/prio_';

constructor(private textFormatterService: TextFormatterService) {}

formatPriorityStatus(text: string): string {
  return this.textFormatterService.formatPriorityName(text);
}

}
