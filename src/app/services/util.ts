import { Injectable } from '@angular/core';
import { AlertController, ToastController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Util {
  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform
  ) {}

  async showAlert({ header = 'ABCU', subHeader = '', message = '' }) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  async showToast({ message = '' }) {
    await this.platform.ready();
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'primary',
    });
    (await toast).present();
  }
}
