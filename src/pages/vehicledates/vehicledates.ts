import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VehicleDate } from '../../models/vehicledate';
import { Vehicle } from '../../models/vehicle';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { VehicleActions } from '../../app/app.actions';
import { Platform } from 'ionic-angular';
import { ActivatedRoute, Params} from '@angular/router';
import { DateFormat } from '../../services/date-format';
import { IdGeneratorService } from '../../services/id-generator';
import { DatePicker } from '@ionic-native/date-picker';
import {ILocalNotification, LocalNotifications} from '@ionic-native/local-notifications';


@Component({
    templateUrl: 'vehicledates.html',
    providers: [
        IdGeneratorService,
        DateFormat,
        DatePicker,
        LocalNotifications
    ]
})
export class VehicleDatesPage {
    vehicleDates$ : Observable<VehicleDate[]>;
    vehicleDatesPast$ : Observable<VehicleDate[]>;
    vehicleDatesFuture$ : Observable<VehicleDate[]>;
    vehicleDate : VehicleDate;
    showDateEdit : boolean = false;
    private vehicle : Vehicle;
    private title : string;
    addDateText: string = 'Datum wählen';
    dateSwitch: string = 'past';

    public constructor(
        private ngRedux : NgRedux<IAppState>,
        private vehicleActions : VehicleActions,
        private route : ActivatedRoute,
        private idGeneratorService: IdGeneratorService,
        private platform : Platform,
        private datePicker: DatePicker,
        private localNotifications: LocalNotifications
    ) {
      let currentDate = new Date();

      this.vehicleDates$ = this.ngRedux.select('vehicleDates')
        .withLatestFrom(this.route.params, ( dates : VehicleDate[], params : Params) => dates
          .filter((date : VehicleDate) => {
            return date.vehicleId === params['vehicleId'];
          })
        );

      this.vehicleDatesPast$ = this.vehicleDates$.map((vehicleDates: VehicleDate[]) => {
        return vehicleDates.filter((vehicleDate: VehicleDate) => new Date(vehicleDate.date) <= currentDate)
          .sort((vehicleDate1: VehicleDate, vehicleDate2: VehicleDate) => {
            if (vehicleDate1.date > vehicleDate2.date) return -1;
            if (vehicleDate1.date === vehicleDate2.date) return 0;
            if (vehicleDate1.date < vehicleDate2.date) return 1;
          })
      });

      this.vehicleDatesFuture$ = this.vehicleDates$.map((vehicleDates: VehicleDate[]) => {
        return vehicleDates.filter((vehicleDate: VehicleDate) => new Date(vehicleDate.date) > currentDate)
          .sort((vehicleDate1: VehicleDate, vehicleDate2 : VehicleDate) => {
            if (vehicleDate1.date < vehicleDate2.date) return -1;
            if (vehicleDate1.date === vehicleDate2.date) return 0;
            if (vehicleDate1.date > vehicleDate2.date) return 1;
          })
      });


      this.ngRedux.select('vehicles')
        .withLatestFrom(
          this.route.params,
          (vehicles : Vehicle[], params : Params) => vehicles.find(vehicle => vehicle.id === params['vehicleId'])
        )
        .subscribe((vehicle : Vehicle) => {
          this.vehicle = Object.assign({}, vehicle);
        });
    }

    createVehicleDate() {
        this.vehicleDate = {
            id: this.idGeneratorService.getId(),
            vehicleId: this.vehicle.id,
            action: null,
            date: null,
            notifiy: false
        }
    }

    onNewDatePickerTap() : void {
        if (this.platform.is('cordova')) {
            this.showDatePicker();
        } else {
            this.insertDate(DateFormat.createRandomDatePast());
        }
    }

    showDatePicker() : void {
        const insertDateFn = this.insertDate.bind(this);

        this.datePicker.show({
            date: new Date(),
            mode: 'datetime',
        }).then(
            insertDateFn,
            err => console.log('Error occurred while getting date: ', err)
        );
    }

    insertDate (date) {
        this.vehicleDate.date = date;
        this.addDateText = DateFormat.formatGermanDate(date, true);
    }

    onDateDeleteTap(vehicleDate : VehicleDate) : void {
        this.dispatchDateDelete(vehicleDate);
        this.unRegisterNotification(vehicleDate);
    }

    unRegisterNotification(vehicleDate: VehicleDate) {
      if (this.platform.is('cordova')) {
        this.localNotifications.clear(vehicleDate.date.getTime());
      }
    }

    registerNotification(vehicleDate: VehicleDate)
    {
      if (this.platform.is('cordova')) {
        let notificationOptions: ILocalNotification = {
          id: vehicleDate.date.getTime(),
          title: `Terminerinnerung: ${vehicleDate.action}`,
          text: `Vergiss nicht deinen Termin: "${vehicleDate.action}" 
                 heute um ${vehicleDate.date.getHours()}:${vehicleDate.date.getMinutes()}`,
          at: vehicleDate.date.setHours(vehicleDate.date.getHours() - 1)
        };

        this.localNotifications.schedule(notificationOptions);
      }
    }

    onNewDateTap() : void {
        this.dispatchDateAdd(this.vehicleDate);
        if (this.vehicleDate.notifiy) {
          this.registerNotification(this.vehicleDate);
        }
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

    formatGermanDate(date, includeTime: boolean = false) {
        if (Boolean(date) && typeof(date) === 'string') {
            date = new Date(date);
        }
        return DateFormat.formatGermanDate(date, includeTime);
    }
}
