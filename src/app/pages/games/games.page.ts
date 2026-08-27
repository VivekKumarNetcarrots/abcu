import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenu,
  IonMenuButton,
  MenuController,
} from '@ionic/angular/standalone';
import { GamesContainerComponent } from 'src/app/comps/games-container/games-container.component';
import { addIcons } from 'ionicons';
import { home, menu } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { ContactComponent } from 'src/app/comps/contact/contact.component';
import { PrivacyComponent } from 'src/app/comps/privacy/privacy.component';
import { AboutComponent } from 'src/app/comps/about/about.component';

@Component({
  selector: 'app-games',
  templateUrl: 'games.page.html',
  styleUrls: ['games.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    IonMenu,
    IonMenuButton,
  ],
})
export class GamesPage {
  selectedGame: any;

  gamesList = [
    {
      name: 'Contact Us',
      desc: 'Contact Us 24x7.',
      img: '/assets/gifs/contact.gif',
      url: '/contact',
      component: ContactComponent,
      id: 3,
    },
    {
      name: 'Privacy Policy',
      desc: 'Know Privacy Policy.',
      img: '/assets/gifs/privacy.gif',
      url: '/privacy',
      component: PrivacyComponent,
      id: 4,
    },
    {
      name: 'About US',
      desc: 'Know about us.',
      img: '/assets/gifs/about.gif',
      url: '/about',
      component: AboutComponent,
      id: 5,
    },
  ];

  constructor(private menuC: MenuController) {
    addIcons({ menu, home });
  }

  onGameSelected(event: any) {
    this.selectedGame = event;
    console.log('OnGameSelected:>>>', event);
  }
  onMenuSelect(g: any) {
    this.selectedGame = g.component;
    this.menuC.close();
    // this.navC.navigateForward(g.url);
  }
}
