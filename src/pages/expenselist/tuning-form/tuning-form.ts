import {BaseForm} from '../base-form';
import {DatePicker} from '@ionic-native/date-picker';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../services/id-generator';
import {NgRedux} from '@angular-redux/store';
import {VehicleActions} from '../../../app/app.actions';
import {IAppState} from '../../../store';
import {ActivatedRoute, Router} from '@angular/router';
import {Platform} from 'ionic-angular';
import {ExpenseType} from '../../../models/expense-type';
import {RepairExpense} from '../../../models/expense-type/repair-expense';

@Component({
  templateUrl: 'tuning-form.html',
  providers: [DatePicker]
})
export class TuningForm extends BaseForm {
  title = 'Ausgabe für Zubehör / Tuning erfassen';
  constructor(
    private formBuilder : FormBuilder,
    idGenerator : IdGeneratorService,
    ngRedux : NgRedux<IAppState>,
    vehicleActions: VehicleActions,
    datePicker: DatePicker,
    platform : Platform,
    activatedRoute: ActivatedRoute,
    router: Router
  ) {
    super(
      datePicker,
      platform,
      activatedRoute,
      ngRedux,
      vehicleActions,
      idGenerator,
      router
    );

    this.newExpenseGroup = this.formBuilder.group({
      type: [ExpenseType.TYPE_REPAIR, Validators.required],
      amount: ['', Validators.required],
      mileage: [this.vehicle.mileage],
      date: [this.expenseDate, Validators.required],
      tuning: ['']
    });
  }
}
