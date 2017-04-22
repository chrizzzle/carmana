import { Component } from '@angular/core';
import { Vehicle } from '../../models/vehicle';
import { FuelEvent } from '../../models/fuelevent';
import { NgRedux } from '@angular-redux/store';
import { IAppState} from '../../store';
import { VehicleActions } from '../../app/app.actions';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IdGeneratorService } from '../../services/id-generator';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/merge';

@Component({
    templateUrl: './fuellist.html',
    providers: [
        IdGeneratorService
    ]
})
export class FuelListPage {
    private vehicle : Vehicle;
    private fuelEvents$ : Observable<FuelEvent[]>;
    private newFuelEvent : FuelEvent;

    public constructor(
        private ngRedux : NgRedux<IAppState>,
        private route : ActivatedRoute,
        private vehicleActions : VehicleActions,
        private idGenerator : IdGeneratorService
    ) { 
        
        this.fuelEvents$ = this.route.params
            .withLatestFrom(this.ngRedux
                .select('fuelList'), (params : Params, fuelEvents : FuelEvent[]) => fuelEvents
                    .filter((fuelEvent : FuelEvent) => fuelEvent.vehicleId === params['vehicleId'])
            )

            this.route.params.subscribe((params : Params) => {
                const getIdFn = this.idGenerator.getId.bind(this);
                this.newFuelEvent = {
                    id: getIdFn,
                    vehicleId: params['vehicleId'],
                    date: null,
                    spending: null,


                }
            })
    }

    onFuelEventAddTap() {
        this.ngRedux.dispatch(this.vehicleActions.addFuelEvent(this.newFuelEvent));
    }
}