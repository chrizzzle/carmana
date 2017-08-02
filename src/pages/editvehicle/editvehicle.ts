import {Component} from '@angular/core';
import {Vehicle} from '../../models/vehicle';
import {VehicleImage} from '../../models/vehicleimage';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../../store';
import {VehicleActions} from '../../app/app.actions';
import {Platform} from 'ionic-angular';
import {IdGeneratorService} from '../../services/id-generator';
import {Camera} from '@ionic-native/camera';
import {Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './editvehicle.html',
  providers: [
    IdGeneratorService,
    Camera
  ]
})
export class EditVehiclePage {
  vehicle: Vehicle;
  vehicleImage: VehicleImage;
  title: string = 'Fahrzeug bearbeiten';
  buttonText: string = 'Speichern';
  vehicleSwitch = 'values';

  vehicleSub: Subscription;
  vehicleImageSub: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private ngRedux: NgRedux<IAppState>,
              private vehicleActions: VehicleActions,
              private idGeneratorService: IdGeneratorService,
              private platform: Platform,
              private camera: Camera) {
    this.vehicleSwitch = 'data';
  }

  ngOnInit() {
    this.vehicleSub = this.route.params
      .switchMap((params: Params) => this.ngRedux
        .select(state => state.vehicles
          .find((vehicle: Vehicle) => vehicle.id === params['id'])
        )
      )
      .subscribe((vehicle: Vehicle) => {
        this.vehicle = vehicle ? Object.assign({}, vehicle) : null;
        this.title = `${this.vehicle.make} ${this.vehicle.model}`;
      });

    this.vehicleImageSub = this.route.params
      .switchMap((params: Params) => this.ngRedux
        .select(state => state.vehicleImages
          .find((vehicleImage: VehicleImage) => vehicleImage.vehicleId === params['id'])
        )
      )
      .subscribe((vehicleImage: VehicleImage) => {
        this.vehicleImage = vehicleImage ? Object.assign({}, vehicleImage) : null;
      });
  }

  ngOnDestroy() {
    this.vehicleSub.unsubscribe();
    this.vehicleImageSub.unsubscribe();
  }

  onSaveButtonTap() {
    this.ngRedux.dispatch(this.vehicleActions.editVehicle(this.vehicle));
    this.router.navigate(['/viewvehicle', this.vehicle.id]);
  }

  onTakeImageTap(): void {
    if (this.platform.is('cordova')) {
      this.takePicture();
    } else {
      this.dispatchImageAdd('https://placehold.it/300x300');
    }
  }

  onImageDeleteTap(): void {
    this.dispatchImageDelete(this.vehicleImage);
  }

  dispatchImageDelete(image: VehicleImage) {
    this.ngRedux.dispatch(this.vehicleActions.deleteVehicleImage(image));
  }

  dispatchImageAdd(imageData) {
    const image = {
      id: this.idGeneratorService.getId(),
      url: imageData,
      width: 300,
      height: 300,
      vehicleId: this.vehicle.id,
      correctOrientation: false,
      saveToPhotoAlbum: true
    };

    this.ngRedux.dispatch(this.vehicleActions.addVehicleImage(image));
  }

  takePicture(): void {
    const dispatchImageFn = this.dispatchImageAdd.bind(this);
    this.camera.getPicture({
      quality: 90,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI,
      targetWidth: 600,
      targetHeight: 600
    })
      .then(dispatchImageFn)
      .catch(console.error);
  }
}
