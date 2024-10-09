import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'join-legal-links',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './legal-links.component.html',
  styleUrl: './legal-links.component.scss',
})
export class LegalLinksComponent {
  @Input() legalLinksClass: string = '';
  @Input() innerLegalLinksClass: string = '';
}
