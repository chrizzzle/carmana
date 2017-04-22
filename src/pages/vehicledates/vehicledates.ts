import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VehicleDate } from '../../models/vehicledate';
import { Vehicle } from '../../models/vehicle';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { VehicleActions } from '../../app/app.actions';
import { DatePicker } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { DateFormat } from '../../services/date-format';
import { IdGeneratorService } from '../../services/id-generator';

@Component({
    templateUrl: 'vehicledates.html',
    providers: [
        IdGeneratorService,
        DateFormat
    ]
})
export class VehicleDatesPage {
    vehicleDates$ : Observable<VehicleDate[]>;
    private vehicleDate : VehicleDate;
    private showDateEdit : boolean = false;
    private vehicle : Vehicle;
    private title : string;
    addDateText: string = 'Datum wählen';

    public constructor(
        private ngRedux : NgRedux<IAppState>,
        private vehicleActions : VehicleActions,
        private route : ActivatedRoute,
        private idGeneratorService: IdGeneratorService,
        private platform : Platform,
    ) {
        
    }

    ngOnInit() {
        this.route.params
            .switchMap((params : Params) => this.ngRedux
                .select(state => state.vehicles
                    .find((vehicle : Vehicle) => vehicle.id === params['vehicleId'])
                )
            )
            .subscribe((vehicle : Vehicle) => {
                this.vehicle = vehicle ? Object.assign({}, vehicle) : null;
                this.title = `${this.vehicle.make} ${this.vehicle.model}`;

                this.vehicleDates$ = this.ngRedux
                    .select('vehicleDates')
                    .map((vehicleDates : VehicleDate[]) => vehicleDates
                        .filter((vehicleDate: VehicleDate) => vehicleDate.vehicleId === this.vehicle.id)
                        .sort((vehicleDate1 : VehicleDate, vehicleDate2 : VehicleDate) => {
                            if (vehicleDate1.date > vehicleDate2.date) return -1;
                            if (vehicleDate1.date < vehicleDate2.date) return 1;
                            if (vehicleDate1.date === vehicleDate2.date) return 0;
                        })
                    );
            });
    }

    createVehicleDate() {
        this.vehicleDate = {
            id: this.idGeneratorService.getId(),
            vehicleId: this.vehicle.id,
            action: null,
            date: null
        }
    }

    onNewDatePickerTap() : void {
        if (this.platform.is('cordova')) {
            this.showDatePicker();
        } else {
            this.insertDate(new Date('2017-04-15'));
        }
    }

    showDatePicker() : void {
        const insertDateFn = this.insertDate.bind(this);

        DatePicker.show({
            date: new Date(),
            mode: 'date',
        }).then(
            insertDateFn,
            err => console.log('Error occurred while getting date: ', err)
        );
    }

    insertDate (date) {
        this.vehicleDate.date = date;
        this.addDateText = DateFormat.formatGermanDate(date);
    }

    onDateDeleteTap(vehicleDate : VehicleDate) : void {
        this.dispatchDateDelete(vehicleDate);
    }

    onNewDateTap() : void {
        this.dispatchDateAdd(this.vehicleDate);
        this.toggleDateAdd();
    }

    dispatchDateDelete(vehicleDate : VehicleDate) : void {
        this.ngRedux.dispatch(this.vehicleActions.deleteVehicleDate(vehicleDate));
    }

    dispatchDateAdd(vehicleDate : VehicleDate) : void {
        this.ngRedux.dispatch(this.vehicleActions.addVehicleDate(vehicleDate));
    }

    onDateAddTap() : void {
        this.toggleDateAdd();
    }

    toggleDateAdd() {
        this.showDateEdit = !this.showDateEdit;

        if (this.showDateEdit) {
            this.createVehicleDate();
            this.addDateText = 'Datum wählen';
        }
    }

    formatGermanDate(date) {
        if (Boolean(date) && typeof(date) === 'string') {
            date = new Date(date);
        }
        return DateFormat.formatGermanDate(date);
    }
}