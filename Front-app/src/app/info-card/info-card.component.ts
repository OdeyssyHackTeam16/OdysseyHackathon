import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() unit: string = '';
}
