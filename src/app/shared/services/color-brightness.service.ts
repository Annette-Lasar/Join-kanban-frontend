import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorBrightnessService {
  convertHexToRgb(hex: string): number[] {
    hex = hex.replace('#', '');

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
  }

  isColorBright(hexColor: string): boolean {
    const rgb = this.convertHexToRgb(hexColor);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128;
  }
}
