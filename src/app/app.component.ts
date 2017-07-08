import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'app.html',
  providers: [
    StatusBar,
    SplashScreen
  ]
})
export class MyApp {
  title: string = 'CarMana';

  constructor(
    private platform: Platform,
    private splash: SplashScreen,
    private statusBar: StatusBar,
    private router : Router
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splash.hide();
    });
  }

  onRootButtonClick() {
    this.router.navigate(['/']);
  }
}
