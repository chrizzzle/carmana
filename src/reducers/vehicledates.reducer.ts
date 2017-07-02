import { VehicleActions } from '../app/app.actions';
import { getIndex } from '../services/get-index';
import { IAppState } from '../store';
import { Payload } from '../models/payload';

export function vehicleDates(lastState: IAppState, action : Payload) : IAppState {
    switch (action.type) {
    
        case VehicleActions.ADD_VEHICLE_DATE : 
            return Object.assign({}, lastState, {
                vehicleDates: [...lastState.vehicleDates, action.payload]
            });

        case VehicleActions.DELETE_VEHICLE_DATE : 
            const vehicleDateIndexToDelete = getIndex(lastState.vehicleDates, action.payload)
            
            if (vehicleDateIndexToDelete > -1) {
                return Object.assign({}, lastState, {
                    vehicleDates: [
                        ...lastState.vehicleDates.slice(0, vehicleDateIndexToDelete),
                        ...lastState.vehicleDates.slice(vehicleDateIndexToDelete + 1),
                    ]
                });
            }
            throw Error(`VehicleDate cannot be deleted. Date with id ${action.payload.id} not found`);
    }
    return lastState;
}