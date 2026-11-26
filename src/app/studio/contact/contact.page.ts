import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icons/icons.component';
import { CONTACT_PHONE } from './contact-details';

@Component({
  imports: [RouterLink, IconComponent],
  styleUrl: './contact.page.scss',
  templateUrl: './contact.page.html',
})
export class ContactPage {
  readonly phoneLink = `tel:${CONTACT_PHONE}`;
  readonly viberLink = `viber://chat?number=${encodeURIComponent(CONTACT_PHONE)}`;
  readonly whatsappLink = `https://wa.me/${CONTACT_PHONE.slice(1)}`;
}
