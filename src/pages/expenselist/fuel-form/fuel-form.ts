import {Component} from '@angular/core';
import {BaseForm} from '../base-form';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../services/id-generator';
import {VehicleActions} from '../../../app/app.actions';
import {NgRedux} from '@angular-redux/store';
import {ActivatedRoute} from '@angular/router';
import {IAppState} from '../../../store';
import {DatePicker} from '@ionic-native/date-picker';
import {Platform} from 'ionic-angular';
import {ExpenseType} from '../../../models/expense-type';
import {FuelExpense} from '../../../models/expense-type/fuel-expense';

@Component({
  templateUrl: 'fuel-form.html',
  providers: [
    DatePicker
  ]
})
export class FuelForm extends BaseForm {
  constructor(
    private formBuilder : FormBuilder,
    idGenerator : IdGeneratorService,
    ngRedux : NgRedux<IAppState>,
    vehicleActions: VehicleActions,
    datePicker: DatePicker,
    platform : Platform,
    activatedRoute: ActivatedRoute
  ) {
    super(
      datePicker,
      platform,
      activatedRoute,
      ngRedux,
      vehicleActions,
      idGenerator
    );

    this.newExpenseGroup = this.formBuilder.group({
      type: [ExpenseType.TYPE_FUEL, Validators.required],
      amount: ['', Validators.required],
      mileage: [this.vehicle.mileage],
      date: [this.expenseDate, Validators.required],
      litres: [0]
    });
  }
}
