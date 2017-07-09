import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Vehicle} from '../models/vehicle';
import {NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import {Expense} from '../../models/expense';
import {IAppState} from '../../store';


@Injectable()
export class ExpensesByVehicleResolve implements Resolve<Expense[]> {

  constructor(private ngRedux: NgRedux<IAppState>) {}

  resolve(route: ActivatedRouteSnapshot) {
    let vehicleId = route.paramMap.get('vehicleId');

    return new Observable(observer => {
      this.ngRedux
        .select('expenseList')
        .map((expenses : Expense[]) => expenses.filter(expense => expense.vehicleId === vehicleId))
        .subscribe((expenses: Expense[]) => {
          observer.next(expenses);
          observer.complete();
        });
    });
  }
}
