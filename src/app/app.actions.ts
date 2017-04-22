import { Injectable } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { VehicleDate } from '../models/vehicledate';
import { VehicleImage } from '../models/vehicleimage';
import { FuelEvent } from '../models/fuelevent';
import { Payload} from '../models/payload';



@Injectable()
export class VehicleActions {
    static ADD_VEHICLE = 'ADD_VEHICLE';
    static REMOVE_VEHICLE = 'REMOVE_VEHICLE';
    static EDIT_VEHICLE = 'EDIT_VEHICLE';
    static ADD_VEHICLE_IMAGE = 'ADD_VEHICLE_IMAGE';
    static DELETE_VEHICLE_IMAGE = 'DELETE_VEHICLE_IMAGE';
    static ADD_VEHICLE_DATE = 'ADD_VEHICLE_DATE';
    static DELETE_VEHICLE_DATE = 'DELETE_VEHICLE_DATE';
    static ADD_FUEL_EVENT = 'ADD_FUEL_EVENT';
    static DELETE_FUEL_EVENT = 'DELETE_FUEL_EVENT';

    addVehicle(vehicle: Vehicle) : Payload {
        return {
            type: VehicleActions.ADD_VEHICLE,
            payload: vehicle
        };
    }

    removeVehicle(vehicle : Vehicle) : Payload {
        return {
            type: VehicleActions.REMOVE_VEHICLE,
            payload: vehicle
        };
    }

    editVehicle(vehicle : Vehicle) : Payload {
        return {
            type: VehicleActions.EDIT_VEHICLE,
            payload: vehicle
        };
    }

    addVehicleImage(vehicleImage: VehicleImage) : Payload {
        return {
            type: VehicleActions.ADD_VEHICLE_IMAGE,
            payload: vehicleImage
        };
    }

    deleteVehicleImage(vehicleImage : VehicleImage) : Payload {
        return {
            type: VehicleActions.DELETE_VEHICLE_IMAGE,
            payload: vehicleImage
        };
    }

    addVehicleDate(vehicleDate : VehicleDate) : Payload {
        return {
            type : VehicleActions.ADD_VEHICLE_DATE,
            payload : vehicleDate
        };
    }

    deleteVehicleDate(vehicleDate : VehicleDate) : Payload {
        return {
            type : VehicleActions.DELETE_VEHICLE_DATE,
            payload : vehicleDate
        };
    }

    addFuelEvent(fuelEvent : FuelEvent) : Payload {
        return {
            type: VehicleActions.ADD_FUEL_EVENT,
            payload: fuelEvent
        };
    }

    deleteFuelEvent(fuelEvent : FuelEvent) : Payload {
        return {
            type: VehicleActions.DELETE_FUEL_EVENT,
            payload: fuelEvent
        }
    }
}