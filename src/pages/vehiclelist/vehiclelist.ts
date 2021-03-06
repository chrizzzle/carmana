import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Vehicle } from '../../models/vehicle';
import { VehicleImage } from '../../models/vehicleimage';
import { VehicleDate } from '../../models/vehicledate';

import { NgRedux } from '@angular-redux/store';
import { IAppState} from '../../store';
import { VehicleActions } from '../../app/app.actions';

import { Observable } from 'rxjs/Observable';
import {ActionSheetController, Alert} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {Expense} from '../../models/expense';

@Component({
  templateUrl: 'vehiclelist.html'
})
export class VehicleListPage {
  readonly vehicles$: Observable<Vehicle>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private vehicleActions: VehicleActions,
    private router: Router,
    private actionSheetCtrl : ActionSheetController,
    private alertCtrl : AlertController
  ) {
    this.vehicles$ = ngRedux.select<Vehicle>('vehicles');
  }

  onVehicleTap(vehicle : Vehicle) {
      this.viewVehicle(vehicle);
  }

  getVehicleImage(vehicle: Vehicle) : string {
    const vehicleImage : VehicleImage = this.ngRedux
      .getState().vehicleImages
      .find((vehicleImage : VehicleImage ) => vehicleImage.vehicleId === vehicle.id);
    return vehicleImage ? vehicleImage.url : 'assets/images/vehicle-default.png';
  }

  getVehicleDates(vehicle: Vehicle) : VehicleDate[] {
    return this.ngRedux
      .getState().vehicleDates
      .filter((vehicleDate : VehicleDate) : boolean => vehicleDate.vehicleId === vehicle.id);
  }
  getVehicleStats(vehicle: Vehicle) : Expense[] {
    return this.ngRedux
      .getState().expenseList
      .filter((expense : Expense) : boolean => expense.vehicleId === vehicle.id);
  }
  hasVehicleDates(vehicle : Vehicle) : boolean {
    return this.getVehicleDates(vehicle).length > 0;
  }

  hasVehicleStats(vehicle : Vehicle) {
    return this.getVehicleStats(vehicle).length > 0;
  }

  hasVehicleDateToday(vehicle : Vehicle) : boolean {
    return this.vehicleDate(vehicle) === 1;
  }

  vehicleDate(vehicle : Vehicle) : number {
    const vehicleDates = this.getVehicleDates(vehicle);
    if (vehicleDates.length <= 0) {
      return -1;
    }

    if (this.vehicleDateToday(vehicleDates)) {
      return 1;
    }

    return 0;
  }

  vehicleDateToday(vehicleDates : VehicleDate[]) : boolean {
    return vehicleDates.some((vehicleDate : VehicleDate) => {
      return this.dateIsToday(vehicleDate.date);
    });
  }

  dateIsToday(date : Date) {
    date = typeof(date) === 'object' ? date : new Date(date);
    const today = new Date();

    return (date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear());
  }

  onVehicleBuildTap(vehicle : Vehicle) : void {
    this.presentActionSheet(vehicle);
  }

  addVehicle() : void {
    this.router.navigate(['/addvehicle']);
  }

  viewVehicle(vehicle : Vehicle) : void {
    this.router.navigate(['/viewvehicle', vehicle.id]);
  }

  onVehicleDateTap(event : Event, vehicle : Vehicle) : void {
    event.stopPropagation();
    this.viewVehicleDates(vehicle);
  }

  removeVehiclePrompt(vehicle : Vehicle) : void {
    const removeVehicle = this.removeVehicle.bind(this);
    const prompt: Alert = this.alertCtrl.create({
      title: 'Löschen',
      message: `Möchten Sie das Fahrzeug ${vehicle.make} ${vehicle.model} wirklich löschen?`,
      buttons: [{
        role: 'cancel',
        text: 'Nein'
      }, {
        text: 'Ja',
        handler: data => {
          removeVehicle(vehicle);
        }
      }]
    });

    prompt.present();
  }

  getVehicleId(index : number, vehicle : Vehicle) {
    return vehicle.id;
  }

  removeVehicle(vehicle : Vehicle) : void {
    this.ngRedux.dispatch(this.vehicleActions.removeVehicle(vehicle));
  }

  editVehicle(vehicle : Vehicle) : void {
      this.router.navigate(['/editvehicle', vehicle.id]);
  }

  viewVehicleDates(vehicle : Vehicle) : void {
    this.router.navigate(['/vehicledates', vehicle.id]);
  }

  viewExpenseList(vehicle : Vehicle) : void {
    this.router.navigate(['/expenselist', vehicle.id]);
  }

  onVehicleStatsTap(event : Event, vehicle : Vehicle) : void {
    this.router.navigate(['/statistics', vehicle.id]);
  }

  viewStatisticsFn(vehicle : Vehicle) {
    this.router.navigate(['/statistics', vehicle.id]);
  }

  presentActionSheet(vehicle: Vehicle) : void {
      const removeVehiclFn = this.removeVehiclePrompt.bind(this);
      const viewVehicleFn = this.viewVehicle.bind(this);
      const editVehicleFn = this.editVehicle.bind(this);
      const viewVehicleDatesFn = this.viewVehicleDates.bind(this);
      const viewExpenseListFn = this.viewExpenseList.bind(this);
      const viewStatisicsFn = this.viewStatisticsFn.bind(this);

      let buttons: any = [
        {
          text: 'Löschen',
          role: 'destructive',
          handler: () => {
            actionSheet.dismiss().then(() => {
              removeVehiclFn(vehicle);
            });
            return false;
          }
        }, {
          text: 'Anzeigen',
          handler: () => {
            viewVehicleFn(vehicle);
          }
        }, {
          text: 'Editieren',
          handler: () => {
            editVehicleFn(vehicle);
          }
        }, {
          text: 'Termine',
          handler: () => {
            viewVehicleDatesFn(vehicle);
          }
        }, {
          text: 'Ausgaben',
          handler: () => {
            viewExpenseListFn(vehicle);
          }
        }
      ];

      if (this.hasVehicleStats(vehicle)) {
        buttons.push({
          text: 'Statistiken',
          handler: () => {
            viewStatisicsFn(vehicle)
          }
        });
      }

      buttons.push({
        text: 'Abbrechen',
        role: 'cancel'
      });

      let actionSheet = this.actionSheetCtrl.create({
        title: 'Fahrzeug bearbeiten',
        buttons: buttons
      });
    actionSheet.present();
  }
}
