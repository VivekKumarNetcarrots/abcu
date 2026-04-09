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
    // ✅ SERVICE WORKER UPDATE (toast style trigger)
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

    // ✅ Detect standalone mode
    if (this.isStandalone()) {
      console.log('Running as installed app ✅');
      this.hideBanner();
    } else {
      console.log('Running in browser 🌐');

      // Delay banner for better UX
      setTimeout(() => {
        this.checkInstall();
      }, 3000);
    }

    // ✅ Detect if app installed
    window.addEventListener('appinstalled', () => {
      localStorage.setItem('install_closed', 'true');
      this.hideBanner();
    });

    // ✅ Splash screen hide
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

  checkInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // 🚫 Prevent showing again if user dismissed/installed
      if (localStorage.getItem('install_closed')) return;

      e.preventDefault();
      this.deferredPrompt = e;

      const banner = document.getElementById('install-banner');
      if (banner) banner.style.display = 'flex';
    });
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
