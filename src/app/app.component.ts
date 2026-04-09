import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  deferredPrompt: any;
  constructor(private swUpdate: SwUpdate) {}
  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event: any) => {
        if (event.type === 'VERSION_READY') {
          this.showUpdatePopup();
        }
      });
    }
    if (this.isStandalone()) {
      console.log('Running as installed app ✅');
    } else {
      console.log('Running in browser 🌐');
      this.checkInstall();
    }

    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.transition = 'opacity 0.4s ease';
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
      }
    }, 500); // small delay for smoother UX
  }
  showUpdatePopup() {
    const updateBox = document.getElementById('update-box');
    if (updateBox) updateBox.style.display = 'flex';
  }

  updateApp() {
    window.location.reload();
  }
  isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  checkInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      // show your custom banner
      const banner = document.getElementById('install-banner');
      if (banner) banner.style.display = 'flex';
    });
  }

  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(() => {
        this.deferredPrompt = null;
        this.hideBanner();
      });
    }
  }

  dismissBanner() {
    this.hideBanner();
  }

  hideBanner() {
    const banner = document.getElementById('install-banner');
    if (banner) banner.style.display = 'none';
  }
}
