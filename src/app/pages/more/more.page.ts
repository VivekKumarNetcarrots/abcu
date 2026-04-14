import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-more',
  templateUrl: 'more.page.html',
  styleUrls: ['more.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class MorePage {
  constructor() {}
}
