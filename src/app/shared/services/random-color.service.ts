import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomColorService {
  getRandomColor(): string {
    const characters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += characters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
