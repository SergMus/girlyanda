import { Component, input, signal } from '@angular/core';

interface ComparisonImage {
  readonly src: string;
  readonly alt: string;
}

interface ComparisonImages {
  readonly before: ComparisonImage;
  readonly after: ComparisonImage;
}

export const houseImages: ComparisonImages = {
  before: {src: '/media/house-day.webp', alt: 'Заміський будинок до монтажу святкової підсвітки'},
  after: {src: '/media/house-night.webp', alt: 'Той самий будинок із гірляндами вздовж даху й над входом'},
};

@Component({
  selector: 'gy-compare',
  template: `
    <figure [style.--position.%]="position()">
      <img [src]="images().after.src" [alt]="images().after.alt" width="1200" height="600" loading="lazy" decoding="async">
      <img class="before" [src]="images().before.src" [alt]="images().before.alt" width="1200" height="600" loading="lazy" decoding="async">
      <span class="label before-label" aria-hidden="true">До</span>
      <span class="label after-label" aria-hidden="true">Після</span>
      <div class="divider" aria-hidden="true"><span>‹ ›</span></div>
      <input #slider type="range" min="0" max="100" [value]="position()" aria-label="Порівняння до і після монтажу"
        [attr.aria-valuetext]="'До: ' + position() + '%. Після: ' + (100 - position()) + '%.'"
        (input)="position.set(slider.valueAsNumber)">
    </figure>
  `,
  styles: [`
    figure { position: relative; margin: 0; overflow: hidden; isolation: isolate; aspect-ratio: 4/3; background: var(--dark); }
    img { width: 100%; height: 100%; object-fit: cover; }
    .before { position: absolute; inset: 0; clip-path: inset(0 calc(100% - var(--position)) 0 0); }
    .divider { position: absolute; top: 0; bottom: 0; width: 2px; left: var(--position); background: #fff; }
    .divider span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; background: var(--paper); color: var(--ink); width: 44px; height: 44px; display: grid; place-items: center; font-weight: 700; white-space: nowrap; }
    .label { position: absolute; bottom: .8rem; color: #fff; background: #14140fdd; padding: .3rem .65rem; font-size: .83rem; }
    .before-label { left: .8rem; } .after-label { right: .8rem; }
    input { appearance: none; position: absolute; inset: 0; margin: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; }
    input::-webkit-slider-thumb { appearance: none; width: 1px; height: 100%; }
    input::-moz-range-thumb { border: 0; width: 1px; height: 100%; }
    figure:focus-within { outline: 3px solid var(--focus); outline-offset: 4px; }
    @media (width < 650px) {
      :host(.wide-mobile) figure { aspect-ratio: 17/10; }
      :host(.wide-mobile) img { object-position: 92% center; }
      :host(.wide-mobile) .label { top: .8rem; bottom: auto; }
    }
    @media (min-width: 650px) { figure { aspect-ratio: 2/1; } }
  `],
})
export class CompareComponent {
  readonly images = input(houseImages);
  readonly position = signal(50);
}
