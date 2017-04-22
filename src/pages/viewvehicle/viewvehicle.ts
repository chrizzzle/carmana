import { Component } from '@angular/core';
import { Vehicle } from '../../models/vehicle';
import { VehicleImage } from '../../models/vehicleimage';
import { NgRedux } from '@angular-redux/store'; 
import { IAppState } from '../../store';
import { VehicleActions } from '../../app/app.actions';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    templateUrl: 'viewvehicle.html'
})
export class ViewVehiclePage {
    vehicle : Vehicle;
    vehicleImage : VehicleImage;
    vehicleSwitch : string = 'values';

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private vehicleActions: VehicleActions,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.vehicleSwitch = 'data';
    }

    ngOnInit() {
        this.route.params
            .switchMap(params => this.ngRedux
                .select(state => state.vehicles
                    .find(vehicle => vehicle.id === params['id'])
                )
            )
            .subscribe(vehicle => this.vehicle = vehicle ? Object.assign({}, vehicle) : null);

        this.route.params
            .switchMap((params : Params) => this.ngRedux
                .select(state => state.vehicleImages
                    .find((vehicleImage : VehicleImage) => vehicleImage.vehicleId === params['id'])
                )
            )
            .subscribe((vehicleImage : VehicleImage) => this.vehicleImage = vehicleImage ? Object.assign({}, vehicleImage) : null);
    }

    onVehicleEditTap() : void {
        this.editVehicle(this.vehicle);
    }

    editVehicle(vehicle : Vehicle) : void {
        this.router.navigate(['/editvehicle', vehicle.id]);
    }
}