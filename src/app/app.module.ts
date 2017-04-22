import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { VehicleListPage } from '../pages/vehiclelist/vehiclelist';
import { AddVehiclePage } from '../pages/addvehicle/addvehicle';
import { ViewVehiclePage } from '../pages/viewvehicle/viewvehicle';
import { EditVehiclePage } from '../pages/editvehicle/editvehicle';
import { VehicleDatesPage } from '../pages/vehicledates/vehicledates';
import { FuelListPage } from '../pages/fuellist/fuellist';

import { routing } from '../routes';

import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { rootReducer, IAppState, INITIAL_STATE } from '../store';
import { VehicleActions } from './app.actions';

import { IonicStorageModule, Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    VehicleListPage,
    AddVehiclePage,
    ViewVehiclePage,
    EditVehiclePage,
    VehicleDatesPage,
    FuelListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgReduxModule,
    routing
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    VehicleListPage,
    AddVehiclePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VehicleActions
  ]
})
export class AppModule {
  constructor (
    ngRedux : NgRedux<IAppState>,
    devTools : DevToolsExtension,
    storage : Storage
    ) {
    const storeEnhancers = devTools.isEnabled() ? [ devTools.enhancer() ] : [];

    storage.ready().then(() => {
      storage.get('state').then(state => {
        const initialState = state ? JSON.parse(state) : INITIAL_STATE; 
        ngRedux.configureStore(rootReducer, initialState, [], storeEnhancers);    
      })
    });
    
    ngRedux.select().subscribe(state => storage.set('state', JSON.stringify(state)));
  }
}
