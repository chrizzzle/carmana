import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { VehicleListPage } from '../pages/vehiclelist/vehiclelist';
import { AddVehiclePage } from '../pages/addvehicle/addvehicle';
import { ViewVehiclePage } from '../pages/viewvehicle/viewvehicle';
import { EditVehiclePage } from '../pages/editvehicle/editvehicle';
import { VehicleDatesPage } from '../pages/vehicledates/vehicledates';
import { ExpenseListPage } from '../pages/expenselist/expenselist';
import { StatisticsPage } from '../pages/statistics/statistics';
import { ChartsModule } from 'ng2-charts/ng2-charts';


import { routing } from '../routes';

import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { rootReducer, IAppState, INITIAL_STATE } from '../store';
import { VehicleActions } from './app.actions';

import { IonicStorageModule, Storage } from '@ionic/storage';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {CreditForm} from '../pages/expenselist/credit-form/credit-form';
import {VehicleResolve} from '../resolvers/vehicle';
import {FuelForm} from '../pages/expenselist/fuel-form/fuel-form';
import {InsuranceForm} from '../pages/expenselist/insurance-form/insurance-form';
import {LeasingForm} from '../pages/expenselist/leasing-form/leasing-form';
import {RepairForm} from '../pages/expenselist/repair-form/repair-form';

@NgModule({
  declarations: [
    MyApp,
    VehicleListPage,
    AddVehiclePage,
    ViewVehiclePage,
    EditVehiclePage,
    VehicleDatesPage,
    ExpenseListPage,
    StatisticsPage,
    CreditForm,
    FuelForm,
    InsuranceForm,
    LeasingForm,
    RepairForm
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgReduxModule,
    routing,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    VehicleListPage,
    AddVehiclePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    VehicleActions,
    VehicleResolve
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
