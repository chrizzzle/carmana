import { RouterModule, Routes } from '@angular/router';
import { AddVehiclePage } from './pages/addvehicle/addvehicle';
import { EditVehiclePage } from './pages/editvehicle/editvehicle';
import { ViewVehiclePage } from './pages/viewvehicle/viewvehicle';
import { VehicleListPage } from './pages/vehiclelist/vehiclelist';
import { VehicleDatesPage } from './pages/vehicledates/vehicledates';
import { ExpenseListPage } from './pages/expenselist/expenselist';
import { StatisticsPage } from './pages/statistics/statistics';

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
    component: ExpenseListPage
}, {
    path: 'statistics/:vehicleId',
    component: StatisticsPage
}];

export const routing = RouterModule.forRoot(routes);