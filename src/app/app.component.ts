import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  title: string = 'CarMana';

  constructor(
    platform: Platform, 
    private router : Router
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  onRootButtonClick() {
    this.router.navigate(['/']);
  }
}
