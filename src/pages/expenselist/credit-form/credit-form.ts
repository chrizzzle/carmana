import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../services/id-generator';
import {CreditExpense} from '../../../models/expense-type/credit-expense';
import {Platform} from 'ionic-angular';
import {ExpenseType} from '../../../models/expense-type';
import {NgRedux} from '@angular-redux/store';
import {VehicleActions} from '../../../app/app.actions';
import {IAppState} from '../../../store';
import {ActivatedRoute} from '@angular/router';
import {DatePicker} from '@ionic-native/date-picker';
import {BaseForm} from '../base-form';

@Component({
  templateUrl: '../base-form.html',
  providers: [
    DatePicker
  ]
})
export class CreditForm extends BaseForm {
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
      type: [ExpenseType.TYPE_CREDIT, Validators.required],
      amount: ['', Validators.required],
      mileage: [this.vehicle.mileage],
      date: [this.expenseDate, Validators.required]
    });
  }
}
