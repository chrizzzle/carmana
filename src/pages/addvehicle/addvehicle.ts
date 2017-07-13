import { Component } from '@angular/core';
import { Vehicle } from '../../models/vehicle';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { VehicleActions } from '../../app/app.actions';
import { Router } from '@angular/router';
import { IdGeneratorService } from '../../services/id-generator';

@Component({
    templateUrl: './addvehicle.html',
    providers: [
        IdGeneratorService
    ]
})
export class AddVehiclePage {
    title : string = 'Fahrzeug hinzufügen';
    buttonText : string = 'Erstellen';
    vehicle : Vehicle;
    vehicleSwitch = 'data';

    constructor(
        private ngRedux : NgRedux<IAppState>,
        private vehicleActions: VehicleActions,
        private router: Router,
        private idGeneratorService: IdGeneratorService
    ) {
        this.vehicleSwitch = 'data';
    }

    ngOnInit() {
        this.vehicle = {
            id: this.idGeneratorService.getId(),
            make: null,
            model: null,
            mileage: null,
            consumption: null,
            builddate: null
        };
    }

    onSaveButtonTap() : void {
        this.ngRedux.dispatch(this.vehicleActions.addVehicle(this.vehicle));
        this.router.navigate(['/']);
    }
}
