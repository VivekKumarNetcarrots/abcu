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
import { LuckyNumberComponent } from '../lucky-number/lucky-number.component';
import { FortuneWheelComponent } from '../fortune-wheel/fortune-wheel.component';

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
      img: '/assets/gifs/tic_tac.gif',
      url: '/tic-tic/',
      component: TicTacComponent,
      id: 0,
    },
    {
      name: 'Lucky Number',
      desc: 'Know your luck.',
      img: '/assets/gifs/num-rolls.gif',
      url: '/lucky number/',
      component: LuckyNumberComponent,
      id: 1,
    },
    {
      name: 'Fortune Wheel',
      desc: 'Chance to win big with luck.',
      img: '/assets/gifs/fortune_wheel.gif',
      url: '/fortune wheel/',
      component: FortuneWheelComponent,
      id: 2,
    },
  ];

  constructor() {}

  onGameSelect(game: any) {
    this.onGameSelected.emit(game.component);
  }
}
