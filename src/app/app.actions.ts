import { Injectable } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { VehicleDate } from '../models/vehicledate';
import { VehicleImage } from '../models/vehicleimage';
import { Expense } from '../models/expense';
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
    static ADD_EXPENSE = 'ADD_EXPENSE';
    static DELETE_EXPENSE = 'DELETE_EXPENSE';

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

    addExpense(expense : Expense) : Payload {
        return {
            type: VehicleActions.ADD_EXPENSE,
            payload: expense
        };
    }

    deleteExpense(expense : Expense) : Payload {
        return {
            type: VehicleActions.DELETE_EXPENSE,
            payload: expense
        }
    }
}