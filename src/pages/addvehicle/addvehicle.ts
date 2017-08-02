import {Component} from '@angular/core';
import {Vehicle} from '../../models/vehicle';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../../store';
import {VehicleActions} from '../../app/app.actions';
import {IdGeneratorService} from '../../services/id-generator';
import {Router} from '@angular/router';

@Component({
  templateUrl: './addvehicle.html',
  providers: [
    IdGeneratorService
  ]
})
export class AddVehiclePage {
  title: string = 'Fahrzeug hinzufügen';
  buttonText: string = 'Erstellen';
  vehicle: Vehicle;

  constructor(private ngRedux: NgRedux<IAppState>,
              private vehicleActions: VehicleActions,
              private idGeneratorService: IdGeneratorService,
              private router: Router) {
  }

  ngOnInit() {
    this.vehicle = {
      id: this.idGeneratorService.getId(),
      make: null,
      model: null,
      mileage: null,
      consumption: null,
      builddate: null,
      fuelType: null,
      power: null,
      vin: null
    };
  }

  onSaveButtonTap(): void {
    this.ngRedux.dispatch(this.vehicleActions.addVehicle(this.vehicle));
    this.router.navigate(['/']);
  }
}
