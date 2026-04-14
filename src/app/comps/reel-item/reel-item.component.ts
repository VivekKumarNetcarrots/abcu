import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { GestureController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reel-item',
  templateUrl: './reel-item.component.html',
  styleUrls: ['./reel-item.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ReelItemComponent implements AfterViewInit {
  @ViewChildren('videoPlayer') videoPlayers!: QueryList<ElementRef>;
  @ViewChildren('reelItem') reelItems!: QueryList<ElementRef>;

  currentPlaying: HTMLVideoElement | null = null;

  videos = [
    {
      title: 'Vid 1',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isBuffering: true,
    },
    {
      title: 'Vid 2',
      url: 'https://www.w3schools.com/html/movie.mp4',
      isBuffering: true,
    },
    {
      title: 'Vid 3',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      isBuffering: true,
    },
  ];

  constructor(private gestureCtrl: GestureController) {}

  ngAfterViewInit() {
    this.videoPlayers.changes.subscribe(() => {
      this.initReels();
    });

    setTimeout(() => {
      this.initReels();
    });
  }

  initReels() {
    if (!this.videoPlayers || this.videoPlayers.length === 0) return;

    this.attachVideoEvents();
    this.setupObserver();

    // ✅ Force first video play
    setTimeout(() => {
      const first = this.videoPlayers.first.nativeElement;
      this.playVideo(first);
    }, 300);
  }

  // 🎥 Buffer handling
  attachVideoEvents() {
    this.videoPlayers.forEach((videoRef, index) => {
      const video = videoRef.nativeElement;

      video.onwaiting = () => (this.videos[index].isBuffering = true);
      video.onplaying = () => (this.videos[index].isBuffering = false);
      video.oncanplay = () => (this.videos[index].isBuffering = false);
    });
  }

  // 👀 Observer
  setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          if (entry.isIntersecting) {
            this.playVideo(video);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    this.videoPlayers.forEach((videoRef) => {
      observer.observe(videoRef.nativeElement);
    });
  }

  // ▶️ Play safely
  async playVideo(video: HTMLVideoElement) {
    try {
      if (this.currentPlaying && this.currentPlaying !== video) {
        this.currentPlaying.pause();
        this.currentPlaying.currentTime = 0;
      }

      this.currentPlaying = video;

      video.muted = true;

      if (video.readyState < 2) {
        video.oncanplay = async () => {
          await video.play().catch(() => {});
        };
      } else {
        await video.play();
      }

      this.preloadNext(video);
    } catch (err) {
      console.log(err);
    }
  }

  // ⚡ Preload next video
  preloadNext(current: HTMLVideoElement) {
    const list = this.videoPlayers.toArray();
    const index = list.findIndex((v) => v.nativeElement === current);

    const next = list[index + 1];
    if (next) {
      const nextVideo = next.nativeElement;
      nextVideo.preload = 'auto';
      nextVideo.load();
    }
  }

  // 👆 Tap → unmute
  togglePlay(index: number) {
    const video = this.videoPlayers.toArray()[index].nativeElement;

    if (video.muted) {
      video.muted = false;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}
