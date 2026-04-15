import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-more',
  templateUrl: 'more.page.html',
  styleUrls: ['more.page.scss'],
  imports: [IonContent, IonGrid, IonRow, IonCol, IonChip, RouterModule],
})
export class MorePage {
  constructor() {}
}
