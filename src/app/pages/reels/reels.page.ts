import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ReelItemComponent } from 'src/app/comps/reel-item/reel-item.component';

@Component({
  selector: 'app-reels',
  templateUrl: 'reels.page.html',
  styleUrls: ['reels.page.scss'],
  imports: [IonContent, ReelItemComponent],
})
export class ReelsPage {
  constructor() {}
}
