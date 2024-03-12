import { Component, OnInit } from '@angular/core';
import { FcmService } from './services/fcm/fcm.service';
import { Platform } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotification,
  PushNotifications,
  PushNotificationSchema,
  PushNotificationToken,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
       
        PushNotifications.register();
      } else {
        
      }
    });
    console.log('Initializing Notifications');
    // PushNotifications.requestPermissions().then((result) => {
    //   if (result.receive === 'granted') {
    //     PushNotifications.register();
    //   } else {
    //   }
    // });

    // PushNotifications.addListener('registration', (token: Token) => {
    //   alert('Push registration success, token: ' + token.value);
    // });

    // PushNotifications.addListener('registrationError', (error: any) => {
    //   alert('Error on registration: ' + JSON.stringify(error));
    // });

    // PushNotifications.addListener(
    //   'pushNotificationReceived',
    //   (notification: PushNotificationSchema) => {
    //     alert('Push received: ' + JSON.stringify(notification));
    //   }
    // );

    // PushNotifications.addListener(
    //   'pushNotificationActionPerformed',
    //   (notification: ActionPerformed) => {
    //     alert('Push action performed: ' + JSON.stringify(notification));
    //   }
    // );
  }
}
