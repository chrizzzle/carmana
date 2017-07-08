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
import {OtherExpense} from '../../../models/expense-type/other-expense';

@Component({
  templateUrl: 'other-form.html',
  providers: [
    DatePicker
  ]
})
export class OtherForm extends BaseForm {
  newExpenseGroup : FormGroup;

  constructor(
    private formBuilder : FormBuilder,
    private idGenerator : IdGeneratorService,
    private ngRedux : NgRedux<IAppState>,
    private vehicleActions: VehicleActions,
    datePicker: DatePicker,
    platform : Platform,
    activatedRoute: ActivatedRoute
  ) {
    super(datePicker, platform, activatedRoute);

    this.newExpenseGroup = this.formBuilder.group({
      type: [ExpenseType.TYPE_FUEL, Validators.required],
      amount: ['', Validators.required],
      mileage: [this.vehicle.mileage],
      date: [this.expenseDate, Validators.required],
      other: ['']
    });
  }

  onFormSubmit() {
    const getIdFn = this.idGenerator.getId.bind(this);
    const vehicleId = this.vehicle.id;
    const formValue = this.newExpenseGroup.value;

    if (!this.newExpenseGroup.valid) {
      return;
    }

    let fuelExpense : OtherExpense = {
      ...formValue,
      id: getIdFn(),
      vehicleId: vehicleId
    };

    this.ngRedux.dispatch(this.vehicleActions.addExpense(fuelExpense));

    this.resetForm();
  }
}
