import { VehicleActions } from '../app/app.actions';
import { getIndex } from '../services/get-index';
import { IAppState } from '../store';
import { Payload } from '../models/payload';

export function vehicleImages(lastState : IAppState, action : Payload) : IAppState {
    switch (action.type) {
        case VehicleActions.ADD_VEHICLE_IMAGE:
            const imageIndexToAdd = getIndex(lastState.vehicleImages, action.payload);

            if (imageIndexToAdd > -1) {
                return Object.assign({}, lastState, {
                    vehicleImages: [
                        ...lastState.vehicleImages.slice(0, imageIndexToAdd),
                        action.payload,
                        ...lastState.vehicleImages.slice(imageIndexToAdd + 1)
                    ]
                });
            }

            return Object.assign({}, lastState, {
                vehicleImages: [...lastState.vehicleImages, action.payload]
            });

        case VehicleActions.DELETE_VEHICLE_IMAGE:
            const imageIndexToDelete = getIndex(lastState.vehicleImages, action.payload);

            if (imageIndexToDelete > -1) {
                return Object.assign({}, lastState, {
                    vehicleImages: [
                        ...lastState.vehicleImages.slice(0, imageIndexToDelete),
                        ...lastState.vehicleImages.slice(imageIndexToDelete + 1)
                    ]
                });
            }
            throw Error(`VehicleImage cannot be deleted. Image with id ${action.payload.id} not found`);
    }
    return lastState;
}