import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Util {
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
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
    const toast = this.toastController.create({
      message: message,
      mode: 'ios',
      duration: 2000,
      position: 'top',
      color: 'primary',
    });
    (await toast).present();
  }
}
