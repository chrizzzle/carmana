import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Vehicle} from '../models/vehicle';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../store';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';


@Injectable()
export class VehicleResolve implements Resolve<Vehicle> {

  constructor(private ngRedux: NgRedux<IAppState>) {}

  resolve(route: ActivatedRouteSnapshot) {
    let vehicleId = route.parent.paramMap.get('vehicleId');

    //@TODO: refactor, this has to be easier...
    return new Observable(observer => {
      this.ngRedux.select<Vehicle[]>('vehicles').map((vehicles: Vehicle[]) => {
        return vehicles.find((vehicle: Vehicle) => {
          return vehicle.id === vehicleId;
        })
      }).subscribe((vehicle: Vehicle) => {
        observer.next(vehicle);
        observer.complete();
      })
    });
  }
}
