import { Injectable } from '@angular/core';
import { maxTextLength } from '../data/global-variables.data';

@Injectable({
  providedIn: 'root',
})
export class TextFormatterService {
  maxTextLength: number = maxTextLength;

  formatBoardListNameCapitalized(rawName: string): string {
    switch (rawName) {
      case 'toDo':
        return 'To do';
      case 'inProgress':
        return 'In progress';
      case 'awaitFeedback':
        return 'Await feedback';
      case 'done':
        return 'Done';
      default:
        return rawName;
    }
  }

  formatBoardListNameLowercased(rawName: string): string {
    switch (rawName) {
      case 'toDo':
        return 'to do';
      case 'inProgress':
        return 'in progress';
      case 'awaitFeedback':
        return 'await feedback';
      case 'done':
        return 'done';
      default:
        return rawName;
    }
  }

  formatPriorityName(rawName: string): string {
    switch (rawName) {
      case 'urgent':
        return 'Urgent';
      case 'medium': 
        return 'Medium';
      case 'low':
        return 'Low';
      default: 
        return rawName;
    }
  }

  truncateSentence(
    sentence: string,
    maxLength: number = this.maxTextLength
  ): string {
    if (!sentence) return '';

    const words = sentence.split(' ');
    if (words.length <= maxLength) {
      return sentence;
    }

    return words.slice(0, maxLength).join(' ') + ' ...';
  }
}
