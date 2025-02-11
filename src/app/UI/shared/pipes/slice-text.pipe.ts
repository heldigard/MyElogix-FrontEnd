import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceText',
  standalone: true,
})
export class SliceTextPipe implements PipeTransform {
  transform(value: string, maxLength: number): string[] {
    if (!value) {
      return [];
    }
    if (maxLength <= 0) {
      return [value];
    }

    const words = value.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > maxLength && lines.length < 4) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }

    if (currentLine.trim() && lines.length < 4) {
      lines.push(currentLine.trim());
    }

    if (lines.length >= 4) {
      if (lines[3].length > maxLength - 3) {
        lines[3] = lines[3].slice(0, maxLength - 3) + '...';
      } else {
        lines[3] = lines[3].slice(0, lines[3].length) + '...';
      }
    }

    return lines;
  }
}
