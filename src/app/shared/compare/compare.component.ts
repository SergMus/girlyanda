import { Component, input, signal } from '@angular/core';
import { HOUSE_COMPARISON_IMAGES } from './comparison-images';

@Component({
  selector: 'gy-compare',
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
})
export class CompareComponent {
  readonly images = input(HOUSE_COMPARISON_IMAGES);
  readonly position = signal(50);
}
