import { RouterModule, Routes } from '@angular/router';
import { AddVehiclePage } from './pages/addvehicle/addvehicle';
import { EditVehiclePage } from './pages/editvehicle/editvehicle';
import { ViewVehiclePage } from './pages/viewvehicle/viewvehicle';
import { VehicleListPage } from './pages/vehiclelist/vehiclelist';
import { VehicleDatesPage } from './pages/vehicledates/vehicledates';
import { FuelListPage } from './pages/fuellist/fuellist';

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
    path: 'fuellist/:vehicleId',
    component: FuelListPage
}];

export const routing = RouterModule.forRoot(routes);