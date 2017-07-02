import { VehicleActions } from '../app/app.actions';
import { getIndex } from '../services/get-index';
import { IAppState } from '../store';
import { Payload } from '../models/payload';

export function vehicles (lastState : IAppState, action : Payload) : any {
    switch (action.type) {
        case VehicleActions.ADD_VEHICLE: 
            return Object.assign({}, lastState, {
                vehicles: [...lastState.vehicles, action.payload]
            });

        case VehicleActions.REMOVE_VEHICLE: 
            const vehicleIndexToDelete = getIndex(lastState.vehicles, action.payload);
            const vehicleImageIndexToDelete = getIndex(lastState.vehicleImages, action.payload, 'vehicleId');
            const vehicleDates = lastState.vehicleDates.filter(vehicleDate => vehicleDate.vehicleId !== action.payload.id);

            return Object.assign({}, lastState, {
                vehicles: [
                    ...lastState.vehicles.slice(0, vehicleIndexToDelete),
                    ...lastState.vehicles.slice(vehicleIndexToDelete + 1)
                ],
                vehicleImages: [
                    ...lastState.vehicleImages.slice(0, vehicleImageIndexToDelete),
                    ...lastState.vehicleImages.slice(vehicleImageIndexToDelete + 1)
                ],
                vehicleDates: vehicleDates
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