import { Component, input } from '@angular/core';
import type { IconName } from './icon-name';

@Component({
  selector: 'gy-icon',
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss',
})
export class IconComponent {
  readonly name = input.required<IconName>();
}
