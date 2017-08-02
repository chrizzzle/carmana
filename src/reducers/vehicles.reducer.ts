import { VehicleActions } from '../app/app.actions';
import { getIndex } from '../services/get-index';
import { IAppState } from '../store';
import { Payload } from '../models/payload';
import {Vehicle} from '../models/vehicle';
import {Expense} from '../models/expense';
import {VehicleDate} from '../models/vehicledate';
import {VehicleImage} from '../models/vehicleimage';

export function vehicles (lastState : IAppState, action : Payload) : any {
    switch (action.type) {
        case VehicleActions.ADD_VEHICLE:
            return Object.assign({}, lastState, {
                vehicles: [...lastState.vehicles, action.payload]
            });

      case VehicleActions.REMOVE_VEHICLE:
            return Object.assign({}, lastState, {
                expenseList: lastState.expenseList.filter((expense: Expense) => expense.id !== action.payload.id),
                vehicles: lastState.vehicles.filter((vehicle:Vehicle) => vehicle.id !== action.payload.id),
                vehicleDates: lastState.vehicleDates.filter((vehicleDate: VehicleDate) => vehicleDate.vehicleId !== action.payload.id),
                vehicleImages: lastState.vehicleImages.filter((vehicleImage: VehicleImage) => vehicleImage.vehicleId !== action.payload.id)
            });

        case VehicleActions.EDIT_VEHICLE:
            const indexToUpdate = getIndex(lastState.vehicles, action.payload);

            return Object.assign({}, lastState, {
                vehicles: [
                    ...lastState.vehicles.slice(0, indexToUpdate),
                    action.payload,
                    ...lastState.vehicles.slice(indexToUpdate + 1)
                ]
            });
    }
    return lastState;
}
