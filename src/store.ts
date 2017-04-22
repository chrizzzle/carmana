import { Vehicle } from './models/vehicle';
import { VehicleImage } from './models/vehicleimage';
import { FuelEvent } from './models/fuelevent';
import { Payload } from './models/payload';
import { VehicleActions } from './app/app.actions';
import { VehicleDate } from './models/vehicledate';
import { combineReducers } from 'redux';


export interface IAppState {
    vehicles: Vehicle[];
    vehicleImages: VehicleImage[];
    vehicleDates: VehicleDate[];
    fuelList: FuelEvent[];
};

export const INITIAL_STATE: IAppState = {
    vehicles: [],
    vehicleImages: [],
    vehicleDates: [],
    fuelList: []
};

function vehicles (lastState : IAppState, action : Payload) : any {
    switch (action.type) {
        case VehicleActions.ADD_VEHICLE: 
        console.log('ADD_VEHICLE', Object.assign({}, lastState, {
                vehicles: [...lastState.vehicles, action.payload]
            }));
            return Object.assign({}, lastState, {
                vehicles: [...lastState.vehicles, action.payload]
            });

        case VehicleActions.REMOVE_VEHICLE: 
            const vehicleIndexToDelete = getVehicleIndex(lastState.vehicles, action.payload);
            const vehicleImageIndexToDelete = getImageIndexByVehicle(lastState.vehicleImages, action.payload);
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
            const indexToUpdate = getVehicleIndex(lastState.vehicles, action.payload);

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

function vehicleImages(lastState : IAppState, action : Payload) : IAppState {
    switch (action.type) {
        case VehicleActions.ADD_VEHICLE_IMAGE:
            const imageIndexToAdd = getVehicleImageIndex(lastState.vehicleImages, action.payload);

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
            const imageIndexToDelete = getVehicleImageIndex(lastState.vehicleImages, action.payload);

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

function vehicleDates(lastState: IAppState, action : Payload) : IAppState {
    switch (action.type) {
    
        case VehicleActions.ADD_VEHICLE_DATE : 
            return Object.assign({}, lastState, {
                vehicleDates: [...lastState.vehicleDates, action.payload]
            });

        case VehicleActions.DELETE_VEHICLE_DATE : 
            const vehicleDateIndexToDelete = getVehicleDateIndex(lastState.vehicleDates, action.payload)
            
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

function fuelList(lastState: IAppState, action : Payload) : IAppState {
    switch (action.type) {
        case VehicleActions.ADD_FUEL_EVENT : 
            return Object.assign({}, lastState, {
                fuelList: [...lastState.fuelList, action.payload]
            });

        case VehicleActions.DELETE_FUEL_EVENT : 
            const fuelEventIndexToDelete = getVehicleDateIndex(lastState.vehicleDates, action.payload)
            
            if (fuelEventIndexToDelete > -1) {
                return Object.assign({}, lastState, {
                    fuelList: [
                        ...lastState.fuelList.slice(0, fuelEventIndexToDelete),
                        ...lastState.fuelList.slice(fuelEventIndexToDelete + 1)
                    ]
                });
            }
            throw Error(`Fuel event cannot be deleted. Event with id ${action.payload.id} not found`);
    }

    return lastState;
}

export function rootReducer(lastState: IAppState, action: Payload) {
    return combineReducers({
        vehicles,
        vehicleImages,
        vehicleDates,
        fuelList
    }) (lastState, action);

/*
    let state = vehicles(lastState, action);
    state = vehicleImages(state, action);
    state = vehicleDates(state, action);
    state = fuelList(state, action);
    return state;
    */
}


function getImageIndexByVehicle(vehicleImages : VehicleImage[], vehicle : Vehicle) : number {
    return vehicleImages
        .indexOf(vehicleImages
            .find((vehicleImage : VehicleImage) => vehicleImage.vehicleId === vehicle.id));
}

function getVehicleDateIndex(vehicleDates : VehicleDate[], vehicleDate : VehicleDate) : number {
    return vehicleDates
        .indexOf(vehicleDates
            .find((currentVehicleDate: VehicleDate) => currentVehicleDate.id === vehicleDate.id));
}

function getVehicleImageIndex(vehicleImages : VehicleImage[], vehicleImage : VehicleImage) : number {
    return vehicleImages
        .indexOf(vehicleImages
            .find((currentVehicleImage : VehicleImage) => currentVehicleImage.id === vehicleImage.id)
        );
}

function getVehicleIndex(vehicles : Vehicle[], vehicle : Vehicle) : number {
    return vehicles
        .indexOf(vehicles
            .find((currentVehicle : Vehicle) => currentVehicle.id === vehicle.id)
        );
}