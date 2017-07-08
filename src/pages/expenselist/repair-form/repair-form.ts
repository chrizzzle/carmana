import {BaseForm} from '../base-form';
import {DatePicker} from '@ionic-native/date-picker';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../services/id-generator';
import {NgRedux} from '@angular-redux/store';
import {VehicleActions} from '../../../app/app.actions';
import {IAppState} from '../../../store';
import {ActivatedRoute} from '@angular/router';
import {Platform} from 'ionic-angular';
import {ExpenseType} from '../../../models/expense-type';
import {RepairExpense} from '../../../models/expense-type/repair-expense';

@Component({
  templateUrl: '../base-form.html',
  providers: [DatePicker]
})
export class RepairForm extends BaseForm {
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
      type: [ExpenseType.TYPE_REPAIR, Validators.required],
      amount: ['', Validators.required],
      mileage: [this.vehicle.mileage],
      date: [this.expenseDate, Validators.required],
      repair: ['']
    });
  }

  onFormSubmit() {
    const getIdFn = this.idGenerator.getId.bind(this);
    const vehicleId = this.vehicle.id;
    const formValue = this.newExpenseGroup.value;

    if (!this.newExpenseGroup.valid) {
      return;
    }

    let leasingExpense: RepairExpense = {
      ...formValue,
      id: getIdFn(),
      vehicleId: vehicleId
    };

    this.ngRedux.dispatch(this.vehicleActions.addExpense(leasingExpense));

    this.resetForm();
  }
}