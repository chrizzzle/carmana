import { RouterModule, Routes } from '@angular/router';
import { AddVehiclePage } from './pages/addvehicle/addvehicle';
import { EditVehiclePage } from './pages/editvehicle/editvehicle';
import { ViewVehiclePage } from './pages/viewvehicle/viewvehicle';
import { VehicleListPage } from './pages/vehiclelist/vehiclelist';
import { VehicleDatesPage } from './pages/vehicledates/vehicledates';
import { ExpenseListPage } from './pages/expenselist/expenselist';
import { StatisticsPage } from './pages/statistics/statistics';
import {CreditForm} from './pages/expenselist/credit-form/credit-form';
import {VehicleResolve} from './resolvers/vehicle';
import {FuelForm} from './pages/expenselist/fuel-form/fuel-form';
import {InsuranceForm} from './pages/expenselist/insurance-form/insurance-form';
import {LeasingForm} from './pages/expenselist/leasing-form/leasing-form';
import {RepairForm} from './pages/expenselist/repair-form/repair-form';

const routes: Routes = [{
    path: '',
    component: VehicleListPage
}, {
    path: 'addvehicle',
    component: AddVehiclePage
}, {
    path: 'viewvehicle/:id',
    component: ViewVehiclePage
}, {
    path: 'vehiclelist',
    component: VehicleListPage
}, {
    path: 'editvehicle/:id',
    component: EditVehiclePage
}, {
    path: 'vehicledates/:vehicleId',
    component: VehicleDatesPage
}, {
    path: 'expenselist/:vehicleId',
    component: ExpenseListPage,
    children: [{
      path: 'credit-form',
      component: CreditForm,
      outlet: 'expenseform',
      resolve: {
        vehicle: VehicleResolve
      }
    }, {
      path: 'fuel-form',
      component: FuelForm,
      outlet: 'expenseform',
      resolve: {
        vehicle: VehicleResolve
      }
    }, {
      path: 'insurance-form',
      component: InsuranceForm,
      outlet: 'expenseform',
      resolve: {
        vehicle: VehicleResolve
      }
    }, {
      path: 'leasing-form',
      component: LeasingForm,
      outlet: 'expenseform',
      resolve: {
        vehicle: VehicleResolve
      }
    }, {
      path: 'repair-form',
      component: RepairForm,
      outlet: 'expenseform',
      resolve: {
        vehicle: VehicleResolve
      }
    // }, {
    //   path: 'other-form',
    //   component: OtherForm,
    //   outlet: 'expenseform'
    // }, {
    //   path: 'tax-form',
    //   component: TaxForm,
    //   outlet: 'expenseform'
    }]
}, {
    path: 'statistics/:vehicleId',
    component: StatisticsPage
}];

export const routing = RouterModule.forRoot(routes);
