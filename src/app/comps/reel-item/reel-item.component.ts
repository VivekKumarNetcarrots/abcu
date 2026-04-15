import {
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { GestureController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AudioManagerService } from 'src/app/services/audio-manager';

@Component({
  selector: 'app-reel-item',
  standalone: true,
  templateUrl: './reel-item.component.html',
  styleUrls: ['./reel-item.component.scss'],
  imports: [CommonModule],
})
export class ReelItemComponent implements AfterViewInit {
  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChildren('videoPlayer') videoPlayers!: QueryList<ElementRef>;

  currentIndex = 0;
  isAnimating = false;

  videos = [
    {
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isBuffering: true,
    },
    {
      url: 'https://www.w3schools.com/html/movie.mp4',
      isBuffering: true,
    },
    {
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      isBuffering: true,
    },
  ];

  constructor(
    private gestureCtrl: GestureController,
    private audioManager: AudioManagerService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.playCurrent();
      this.setupGesture();
      this.attachVideoEvents();
    });
  }

  attachVideoEvents() {
    this.videoPlayers.forEach((videoRef, index) => {
      const video = videoRef.nativeElement;
      this.audioManager.register(video);
      video.onwaiting = () => (this.videos[index].isBuffering = true);
      video.onplaying = () => (this.videos[index].isBuffering = false);
      video.oncanplay = () => (this.videos[index].isBuffering = false);
    });
  }

  playCurrent() {
    const videos = this.videoPlayers.toArray();

    videos.forEach((v, i) => {
      const vid = v.nativeElement;

      if (i === this.currentIndex) {
        vid.muted = false;
        this.audioManager.play(vid);
        // vid.play().catch(() => {});
        this.preloadNext(i);
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }

  preloadNext(index: number) {
    const next = this.videoPlayers.toArray()[index + 1];
    if (next) {
      const vid = next.nativeElement;
      vid.preload = 'auto';
      vid.load();
    }
  }

  toggleSound() {
    this.audioManager.toggleMute();
  }

  setupGesture() {
    const gesture = this.gestureCtrl.create({
      el: this.container.nativeElement,
      gestureName: 'vertical-swipe',
      direction: 'y',
      onEnd: (ev) => {
        if (this.isAnimating) return;

        if (ev.deltaY < -100) {
          this.next();
        } else if (ev.deltaY > 100) {
          this.prev();
        }
      },
    });

    gesture.enable();
  }

  next() {
    if (this.currentIndex >= this.videos.length - 1) return;
    this.slideTo(this.currentIndex + 1);
  }

  prev() {
    if (this.currentIndex <= 0) return;
    this.slideTo(this.currentIndex - 1);
  }

  slideTo(index: number) {
    this.isAnimating = true;
    this.currentIndex = index;

    const offset = -index * window.innerHeight;
    this.container.nativeElement.style.transform = `translateY(${offset}px)`;

    setTimeout(() => {
      this.playCurrent();
      this.isAnimating = false;
    }, 300);
  }
}
