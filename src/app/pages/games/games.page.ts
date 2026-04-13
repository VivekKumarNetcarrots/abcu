import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { GamesContainerComponent } from 'src/app/comps/games-container/games-container.component';
import { addIcons } from 'ionicons';
import { flowerOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'games.page.html',
  styleUrls: ['games.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    GamesContainerComponent,
    IonButtons,
    IonButton,
    IonIcon,
  ],
})
export class Tab1Page {
  selectedGame: any;
  constructor() {
    addIcons({ flowerOutline });
  }

  onGameSelected(event: any) {
    this.selectedGame = event;
    console.log('OnGameSelected:>>>', event);
  }
}
