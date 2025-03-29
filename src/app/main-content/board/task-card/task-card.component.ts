import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../shared/interfaces/task.interface';
import { Category } from '../../../shared/interfaces/category.interface';
import { CommonModule } from '@angular/common';
import { TextFormatterService } from '../../../shared/services/text-formatter.service';

@Component({
  selector: 'join-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit {
  @Input() task: Task | null = null;

  category!: Category;
  priorityIconPath: string = 'assets/icons/prio_';
  

  constructor(
    private textFormatterService: TextFormatterService,
  ) {}

  ngOnInit(): void {
    this.initializeTaskCategory();
  }



  initializeTaskCategory(): void {
    if (this.task?.category) {
      this.category = this.task.category;
    }
  }

  getTruncatedText(text: string) {
    return this.textFormatterService.truncateSentence(text);
  }


}
