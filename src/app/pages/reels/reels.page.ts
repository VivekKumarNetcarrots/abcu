import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ReelItemComponent } from 'src/app/comps/reel-item/reel-item.component';
import { AudioManagerService } from 'src/app/services/audio-manager';

@Component({
  selector: 'app-reels',
  templateUrl: 'reels.page.html',
  styleUrls: ['reels.page.scss'],
  imports: [IonContent, ReelItemComponent],
})
export class ReelsPage {
  constructor(private audioManager: AudioManagerService) {}
  ionViewWillEnter() {
    this.audioManager.toggleMute();
  }
  ionViewWillLeave() {
    this.audioManager.pauseAll();
    this.audioManager.forceMuteAll();
  }
}
