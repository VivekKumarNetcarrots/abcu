import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { TicTacComponent } from '../comps/tic-tac/tic-tac.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonContent, TicTacComponent],
})
export class Tab1Page {
  constructor() {}
}
