import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  deferredPrompt: any;

  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    // =========================
    // 📱 INSTALL EVENT (FIXED)
    // =========================
    window.addEventListener('beforeinstallprompt', (e: any) => {
      console.log('Install event fired ✅');

      e.preventDefault();

      // ❌ don't show again if dismissed
      if (localStorage.getItem('install_closed')) return;

      this.deferredPrompt = e;

      // Delay banner for better UX
      setTimeout(() => {
        const banner = document.getElementById('install-banner');
        if (banner) banner.style.display = 'flex';
      }, 3000);
    });

    // =========================
    // 🔄 SERVICE WORKER UPDATE
    // =========================
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter(
            (event): event is VersionReadyEvent =>
              event.type === 'VERSION_READY'
          )
        )
        .subscribe(() => {
          this.showUpdatePopup();
        });
    }

    // =========================
    // 📲 APP INSTALLED DETECT
    // =========================
    window.addEventListener('appinstalled', () => {
      console.log('App installed 🎉');
      localStorage.setItem('install_closed', 'true');
      this.hideBanner();
    });

    // =========================
    // 📱 STANDALONE MODE CHECK
    // =========================
    if (this.isStandalone()) {
      console.log('Running as installed app ✅');
      this.hideBanner();
    } else {
      console.log('Running in browser 🌐');
    }

    // =========================
    // 💥 FALLBACK (if Chrome blocks event)
    // =========================
    setTimeout(() => {
      if (!this.deferredPrompt && !localStorage.getItem('install_closed')) {
        console.log('Fallback banner shown ⚠️');
        const banner = document.getElementById('install-banner');
        if (banner) banner.style.display = 'flex';
      }
    }, 5000);

    // =========================
    // 🌊 SPLASH SCREEN
    // =========================
    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.transition = 'opacity 0.4s ease';
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 400);
      }
    }, 500);
  }

  // =========================
  // 🔄 UPDATE LOGIC
  // =========================

  showUpdatePopup() {
    const updateBox = document.getElementById('update-box');
    if (updateBox) updateBox.style.display = 'flex';
  }

  updateApp() {
    this.swUpdate.activateUpdate().then(() => {
      this.hideUpdatePopup();
      window.location.reload();
    });
  }

  hideUpdatePopup() {
    const updateBox = document.getElementById('update-box');
    if (updateBox) updateBox.style.display = 'none';
  }

  // =========================
  // 📱 INSTALL LOGIC
  // =========================

  isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          localStorage.setItem('install_closed', 'true');
        }

        this.deferredPrompt = null;
        this.hideBanner();
      });
    }
  }

  dismissBanner() {
    localStorage.setItem('install_closed', 'true');
    this.hideBanner();
  }

  hideBanner() {
    const banner = document.getElementById('install-banner');
    if (banner) banner.style.display = 'none';
  }
}
