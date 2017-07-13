import {Component} from '@angular/core';
import {BaseForm} from '../base-form';
import {FormBuilder, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../services/id-generator';
import {VehicleActions} from '../../../app/app.actions';
import {NgRedux} from '@angular-redux/store';
import {ActivatedRoute, Router} from '@angular/router';
import {IAppState} from '../../../store';
import {DatePicker} from '@ionic-native/date-picker';
import {Platform} from 'ionic-angular';
import {ExpenseType} from '../../../models/expense-type';

@Component({
  templateUrl: '../base-form-mileage.html',
  providers: [
    DatePicker
  ]
})
export class OtherForm extends BaseForm {
  title = 'Sonstige Ausgabe erfassen';
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
      type: [ExpenseType.TYPE_OTHER, Validators.required],
      amount: ['', Validators.required],
      mileage: [this.vehicle.mileage],
      date: [this.expenseDate, Validators.required],
      description: ['']
    });
  }
}
