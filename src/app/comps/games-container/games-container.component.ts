import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonText,
  IonNote,
} from '@ionic/angular/standalone';
import { TicTacComponent } from '../tic-tac/tic-tac.component';

@Component({
  selector: 'app-games-container',
  templateUrl: './games-container.component.html',
  styleUrls: ['./games-container.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonText,
    IonNote,
  ],
})
export class GamesContainerComponent {
  @Output() onGameSelected = new EventEmitter<any>();

  gamesList = [
    {
      name: 'Tic Tac',
      desc: 'The most popular mind game.',
      img: '/assets/images/tic-tac.png',
      url: '/tic-tic/',
      component: TicTacComponent,
      id: 0,
    },
  ];

  constructor() {}

  onGameSelect(game: any) {
    this.onGameSelected.emit(game.component);
  }
}
