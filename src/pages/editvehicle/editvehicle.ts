import { Component } from '@angular/core';
import { Vehicle } from '../../models/vehicle';
import { VehicleImage } from '../../models/vehicleimage';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { VehicleActions } from '../../app/app.actions';
import { Camera, DatePicker } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { IdGeneratorService } from '../../services/id-generator';
import { Observable } from 'rxjs/Observable';

@Component({
    templateUrl: './editvehicle.html',
    providers: [
        IdGeneratorService
    ]
})
export class EditVehiclePage {
    vehicle: Vehicle;
    vehicleImage : VehicleImage;
    title : string = 'Fahrzeug bearbeiten';
    buttonText : string = 'Speichern';
    vehicleSwitch = 'values';

    constructor(
        private router: Router,
        private route : ActivatedRoute,
        private ngRedux : NgRedux<IAppState>,
        private vehicleActions: VehicleActions,
        private idGeneratorService: IdGeneratorService,
        private platform : Platform        
    ) {
        this.vehicleSwitch = 'data';
    }

    ngOnInit() {
        this.route.params
            .switchMap((params : Params) => this.ngRedux
                .select(state => state.vehicles
                    .find((vehicle : Vehicle) => vehicle.id === params['id'])
                )
            )
            .subscribe((vehicle : Vehicle) => {
                this.vehicle = vehicle ? Object.assign({}, vehicle) : null;
                this.title = `${this.vehicle.make} ${this.vehicle.model}`;
            });

        this.route.params
            .switchMap((params : Params) => this.ngRedux
                .select(state => state.vehicleImages
                    .find((vehicleImage : VehicleImage) => vehicleImage.vehicleId === params['id'])
                )
            )
            .subscribe((vehicleImage : VehicleImage) => {
                this.vehicleImage = vehicleImage ? Object.assign({}, vehicleImage) : null;
            });
    }

    onSaveButtonTap() {
        this.ngRedux.dispatch(this.vehicleActions.editVehicle(this.vehicle));
        this.router.navigate(['/viewvehicle', this.vehicle.id]);
    }

    onTakeImageTap() : void {
        if (this.platform.is('cordova')) {
            this.takePicture();
        } else {
            this.dispatchImageAdd('https://placehold.it/300x300');
        }
    }

    onImageDeleteTap() : void {
        this.dispatchImageDelete(this.vehicleImage);
    }

    dispatchImageDelete(image : VehicleImage) {
        this.ngRedux.dispatch(this.vehicleActions.deleteVehicleImage(image));
    }

    dispatchImageAdd(imageData) {
        const image = {
            id: this.idGeneratorService.getId(),
            url: imageData,
            width: 300,
            height: 300,
            vehicleId: this.vehicle.id
        };

        this.ngRedux.dispatch(this.vehicleActions.addVehicleImage(image));
    }

    takePicture() : void {
        const dispatchImageFn = this.dispatchImageAdd.bind(this);
        Camera.getPicture({
            destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: 300,
            targetHeight: 300
        })
        .then(dispatchImageFn)
        .catch(console.error);
    }
}