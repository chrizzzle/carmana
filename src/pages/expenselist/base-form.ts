import {DatePicker} from '@ionic-native/date-picker';
import {DateFormat} from '../../services/date-format';
import {Platform} from 'ionic-angular';
import {ActivatedRoute, Router} from '@angular/router';
import {Vehicle} from '../../models/vehicle';
import {FormGroup} from '@angular/forms';
import {VehicleActions} from '../../app/app.actions';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../../store';
import {IdGeneratorService} from '../../services/id-generator';
import {Expense} from '../../models/expense';


export abstract class BaseForm {
  newExpenseGroup : FormGroup;
  addDateText: string = 'Datum hinzufügen';
  expenseDate: Date = new Date();
  vehicle: Vehicle;

  constructor(
    private datePicker: DatePicker,
    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private ngRedux : NgRedux<IAppState>,
    private vehicleActions: VehicleActions,
    private idGenerator : IdGeneratorService,
    private router: Router
  ) {
    this.addDateText = DateFormat.formatGermanDate(this.expenseDate);
    this.vehicle = this.activatedRoute.snapshot.data['vehicle'];
  }

  insertDate (date) {
    this.addDateText = DateFormat.formatGermanDate(date);

    this.newExpenseGroup.setValue({
      ...this.newExpenseGroup.value,
      date: date
    });
  }

  onDatePickerTap() : void {
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
      mode: 'date',
    }).then(
      insertDateFn,
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  resetForm() {
    this.addDateText = DateFormat.formatGermanDate(this.expenseDate);
    this.newExpenseGroup.reset();
  }

  onFormSubmit() {
    const getIdFn = this.idGenerator.getId.bind(this);
    const vehicleId = this.vehicle.id;
    const formValue = this.newExpenseGroup.value;

    if (!this.newExpenseGroup.valid) {
      return;
    }

    let expense = this.createModel(formValue, getIdFn(), vehicleId);

    this.ngRedux.dispatch(this.vehicleActions.addExpense(expense));
    this.resetForm();
    this.router.navigate(['/expenselist/' + this.vehicle.id , {outlets: {'expenseform': null}}]);
  }

  createModel(formValue, id, vehicleId): Expense {
    return {
      ...formValue,
      id: id,
      vehicleId: vehicleId
    };
  }
}
