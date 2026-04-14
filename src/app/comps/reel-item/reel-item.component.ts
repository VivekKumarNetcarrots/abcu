import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
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
  lastTap = 0;

  videos = [
    {
      title: 'Vid 1',
      description: 'Video 1',
      url: 'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/bigbuck_bunny_8bit_15000kbps_1080p_60.0fps_h264.mp4',
      showHeart: false,
      showDetails: false,
    },
    {
      title: 'Vid 2',
      description: 'Video 2',
      url: 'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/cutting_orange_tuil_15000kbps_1080p_59.94fps_h264.mp4',
      showHeart: false,
      showDetails: false,
    },
    {
      title: 'Vid 3',
      description: 'Video 3',
      url: 'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/vegetables_tuil_2000kbps_720p_59.94fps_h264.mp4',
      showHeart: false,
      showDetails: false,
    },
  ];

  constructor(private gestureCtrl: GestureController) {}

  ngAfterViewInit() {
    this.setupObserver();
    this.setupGestures();
  }
  setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (this.currentPlaying && this.currentPlaying !== video) {
              this.currentPlaying.pause();
            }

            this.currentPlaying = video;
            this.playVideo(video);
          }
          // if (entry.isIntersecting) {
          //   this.playVideo(video);
          // } else {
          //   video.pause();
          // }
        });
      },
      { threshold: 0.7 }
    );

    this.videoPlayers.forEach((videoRef) => {
      observer.observe(videoRef.nativeElement);
    });
  }

  // 🎥 Auto Play / Pause
  // setupObserver() {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         const video = entry.target as HTMLVideoElement;
  //         if (entry.isIntersecting) {
  //           if (this.currentPlaying && this.currentPlaying !== video) {
  //             this.currentPlaying.pause();
  //           }

  //           this.currentPlaying = video;
  //           this.playVideo(video);
  //         }
  //         // if (entry.isIntersecting) {
  //         //   video.play();
  //         // } else {
  //         //   video.pause();
  //         // }
  //       });
  //     },
  //     { threshold: 0.7 }
  //   );

  //   this.videoPlayers.forEach((videoRef) => {
  //     observer.observe(videoRef.nativeElement);
  //   });
  // }
  playVideo(video: HTMLVideoElement) {
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Video play error:', err);
        }
      });
    }
  }

  // 👉 Swipe gestures
  setupGestures() {
    this.reelItems.forEach((item, index) => {
      const gesture = this.gestureCtrl.create({
        el: item.nativeElement,
        gestureName: 'reel-swipe',
        direction: 'x',
        onEnd: (ev) => {
          if (ev.deltaX < -100) this.openDetails(index);
          if (ev.deltaX > 100) this.closeDetails(index);
        },
      });

      gesture.enable();
    });
  }

  // 👉 Tap / Double Tap
  onTap(event: any, index: number) {
    const now = Date.now();
    const diff = now - this.lastTap;

    if (diff < 300) {
      this.handleDoubleTap(event, index);
    } else {
      this.togglePlay(index);
    }

    this.lastTap = now;
  }

  togglePlay(index: number) {
    const video = this.videoPlayers.toArray()[index].nativeElement;
    video.paused ? video.play() : video.pause();
  }

  handleDoubleTap(event: any, index: number) {
    this.videos[index].showHeart = true;

    setTimeout(() => {
      this.videos[index].showHeart = false;
    }, 800);

    this.like(index);
    this.createFloatingHeart(event);
  }

  // ❤️ Like + Haptics
  async like(index: number) {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  // 💕 Floating hearts
  createFloatingHeart(event: any) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');

    heart.style.left = event.pageX + 'px';
    heart.style.top = event.pageY + 'px';

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
  }

  // 👉 Details Panel
  openDetails(index: number) {
    this.videos.forEach((v, i) => {
      v.showDetails = i === index;
    });

    document.body.style.overflow = 'hidden';
  }

  closeDetails(index: number) {
    this.videos[index].showDetails = false;
    document.body.style.overflow = 'auto';
  }
}
