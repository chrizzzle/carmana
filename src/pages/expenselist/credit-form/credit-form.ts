import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../services/id-generator';
import {CreditExpense} from '../../../models/expense-type/credit-expense';
import {Platform} from 'ionic-angular';
import {ExpenseType} from '../../../models/expense-type';
import {NgRedux} from '@angular-redux/store';
import {VehicleActions} from '../../../app/app.actions';
import {IAppState} from '../../../store';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePicker} from '@ionic-native/date-picker';
import {BaseForm} from '../base-form';
import {Interval} from '../../../models/expense-type/interval';

@Component({
  templateUrl: '../base-form-interval.html',
  providers: [
    DatePicker
  ]
})
export class CreditForm extends BaseForm {
  title = 'Kreditzahlung erfassen';
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
      type: [ExpenseType.TYPE_CREDIT, Validators.required],
      amount: ['', Validators.required],
      date: [this.expenseDate, Validators.required],
      interval: [Interval.TYPE_NEVER]
    });
  }
}
