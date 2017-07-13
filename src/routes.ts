import { RouterModule, Routes } from '@angular/router';
import { AddVehiclePage } from './pages/addvehicle/addvehicle';
import { EditVehiclePage } from './pages/editvehicle/editvehicle';
import { ViewVehiclePage } from './pages/viewvehicle/viewvehicle';
import { VehicleListPage } from './pages/vehiclelist/vehiclelist';
import { VehicleDatesPage } from './pages/vehicledates/vehicledates';
import { ExpenseListPage } from './pages/expenselist/expenselist';
import { StatisticsPage } from './pages/statistics/statistics';
import { CreditForm } from './pages/expenselist/credit-form/credit-form';
import { VehicleResolve } from './resolvers/vehicle';
import { FuelForm } from './pages/expenselist/fuel-form/fuel-form';
import { InsuranceForm } from './pages/expenselist/insurance-form/insurance-form';
import { LeasingForm } from './pages/expenselist/leasing-form/leasing-form';
import { RepairForm } from './pages/expenselist/repair-form/repair-form';
import { MaintenanceForm } from './pages/expenselist/maintenance-form/maintenance-form';
import { OtherForm } from './pages/expenselist/other-form/other-form';
import { TaxForm } from './pages/expenselist/tax-form/tax-form';
import { TuningForm } from './pages/expenselist/tuning-form/tuning-form';
import { ExpensesByVehicleResolve } from './resolvers/statistics/expenses-by-vehicle';

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
      path: 'maintenance-form',
      component: MaintenanceForm,
      outlet: 'expenseform',
      resolve: {
        vehicle: VehicleResolve
      }
    }, {
      path: 'other-form',
      component: OtherForm,
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
    }, {
      path: 'tax-form',
      component: TaxForm,
      outlet: 'expenseform',
      resolve: {
        vehicle: VehicleResolve
      }
    }, {
      path: 'tuning-form',
      component: TuningForm,
      outlet: 'expenseform',
      resolve: {
        vehicle: VehicleResolve
      }
    }]
}, {
    path: 'statistics/:vehicleId',
    component: StatisticsPage,
    resolve: {
      expenses: ExpensesByVehicleResolve
    }
}];

export const routing = RouterModule.forRoot(routes);
