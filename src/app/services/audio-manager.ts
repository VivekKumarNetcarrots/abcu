import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioManagerService {
  private currentVideo: HTMLVideoElement | null = null;
  private isMuted = true;

  register(video: HTMLVideoElement) {
    video.muted = false;
  }

  play(video: HTMLVideoElement) {
    if (this.currentVideo && this.currentVideo !== video) {
      this.currentVideo.muted = true;
    }

    this.currentVideo = video;

    video.muted = false;

    video.play().catch(() => {});
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.currentVideo) {
      this.currentVideo.muted = this.isMuted;
      if (!this.isMuted) {
        this.currentVideo.play().catch(() => {});
      }
    }
  }

  forceMuteAll() {
    this.isMuted = true;

    if (this.currentVideo) {
      this.currentVideo.muted = true;
    }
  }

  pauseAll() {
    if (this.currentVideo) {
      this.currentVideo.pause();
    }
  }
}
