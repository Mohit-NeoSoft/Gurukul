import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  private newTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {}
  initPush(){
    if(Capacitor.getPlatform() !== 'web'){
      this.registerNotifications();
      this.addListeners();
      this.getDeliveredNotifications();
    } 
  }

  addListeners = async () => {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Registration token: ', token.value);
      this.newTokenSubject.next(token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received: ', notification);
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.inputValue
        );
      }
    );
  };

  async registerNotifications(): Promise<boolean> {
    try {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
      return true;
    } catch (error) {
      console.error('Error registering for notifications:', error);
      return false;
    }
  }

  async getDeliveredNotifications() {
    try {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('delivered notifications', notificationList);
    } catch (error) {
      console.error('Error getting delivered notifications:', error);
    }
  }

  getNewTokenObservable() {
    return this.newTokenSubject.asObservable();
  }
}
