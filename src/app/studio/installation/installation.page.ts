import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompareComponent } from '../../shared/compare/compare.component';
import { WINTER_HOUSE_IMAGES, INSTALLATION_STEPS } from './installation-content';

@Component({
  imports: [RouterLink, CompareComponent],
  styleUrl: './installation.page.scss',
  templateUrl: './installation.page.html',
})
export class InstallationPage {
  readonly winterHouse = WINTER_HOUSE_IMAGES;

  readonly process = INSTALLATION_STEPS;
}
