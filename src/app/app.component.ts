import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {VehicleListPage} from '../pages/vehiclelist/vehiclelist';
import { Location } from '@angular/common';

@Component({
  templateUrl: './app.html',
  providers: [
    StatusBar,
    SplashScreen
  ]
})
export class MyApp {
  title: string = 'CarMana';
  root = VehicleListPage;

  constructor(
    private platform: Platform,
    private splash: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private location: Location
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splash.hide();

      this.router.events
        .filter((event) => event instanceof NavigationEnd)
        .map(() => this.activatedRoute)
        .map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        .filter((route) => route.outlet === 'primary')
        .mergeMap((route) => route.data)
        .subscribe((event) => {
          this.title = event['title'] || 'CarMana'
        });
    });
  }

  showBackButton () {
    return !this.location.isCurrentPathEqualTo('/');
  }

  onBackButtonClick() {
    this.router.navigate(['/']);
  }
}
