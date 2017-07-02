import { Vehicle } from './models/vehicle';
import { VehicleImage } from './models/vehicleimage';
import { Expense } from './models/expense';
import { Payload } from './models/payload';
import { VehicleDate } from './models/vehicledate';
import { vehicles } from './reducers/vehicles.reducer';
import { vehicleImages } from './reducers/vehicleimages.reducer';
import { vehicleDates } from './reducers/vehicledates.reducer';
import { expenseList } from './reducers/expenselist.reducer';



export interface IAppState {
    vehicles: Vehicle[];
    vehicleImages: VehicleImage[];
    vehicleDates: VehicleDate[];
    expenseList: Expense[];
};

export const INITIAL_STATE: IAppState = {
    vehicles: [],
    vehicleImages: [],
    vehicleDates: [],
    expenseList: []
};



export function rootReducer(lastState: IAppState, action: Payload) {
    let state = vehicles(lastState, action);
    state = vehicleImages(state, action);
    state = vehicleDates(state, action);
    state = expenseList(state, action);
    return state;
    
}

