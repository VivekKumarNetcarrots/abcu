import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { NavController } from '@ionic/angular';

interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OnboardingPage implements OnInit {
  slides: Slide[] = [];
  activeIndex = 0;

  constructor(private navC: NavController) {}

  ngOnInit() {
    this.loadSlides();
    this.preloadImages();
  }

  loadSlides() {
    this.slides = [
      {
        title: 'Order from choosen provider',
        description:
          'Get all your loved things in one once place, you just place the order we do the rest',
        image: '/assets/images/image1.png',
      },
      {
        title: 'Fast Delivery',
        description: 'Get your things delivered at lightning speed',
        image: '/assets/images/image2.png',
      },
      {
        title: 'Live Tracking',
        description: 'Track your order in real time',
        image: '/assets/images/image3.png',
      },
    ];
  }

  preloadImages() {
    this.slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }

  async onSlideChange(event: any) {
    this.activeIndex = event.target.swiper.activeIndex;
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  next(swiperEl: any) {
    const swiper = swiperEl.swiper;

    if (this.activeIndex < this.slides.length - 1) {
      swiper.slideNext();
    } else {
      console.log('Go to Home');
      this.navC.navigateRoot('/start');
    }
  }

  skip() {
    console.log('Skip onboarding');
    this.navC.navigateRoot('/home');
  }
}
