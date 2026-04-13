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
    window.addEventListener('beforeinstallprompt', (e: any) => {
      console.log('Install event fired ');

      e.preventDefault();

      if (localStorage.getItem('install_closed')) return;

      this.deferredPrompt = e;

      setTimeout(() => {
        const banner = document.getElementById('install-banner');
        if (banner) banner.style.display = 'flex';
      }, 3000);
    });

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event: any) => {
        console.log('SW Event:', event);

        if (event.type === 'VERSION_READY') {
          this.showUpdatePopup();
        }
      });

      // force periodic check
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 30000);
    }

    window.addEventListener('appinstalled', () => {
      console.log('App installed 🎉');
      localStorage.setItem('install_closed', 'true');
      this.hideBanner();
    });

    if (this.isStandalone()) {
      console.log('Running as installed app ');
      this.hideBanner();
    } else {
      console.log('Running in browser ');
    }

    setTimeout(() => {
      if (!this.deferredPrompt && !localStorage.getItem('install_closed')) {
        console.log('Fallback banner shown ⚠️');
        const banner = document.getElementById('install-banner');
        if (banner) banner.style.display = 'flex';
      }
    }, 5000);

    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.transition = 'opacity 0.4s ease';
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 1500);
      }
    }, 500);
  }

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
