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
import {Interval} from '../../models/expense-type/interval';


export abstract class BaseForm {
  newExpenseGroup : FormGroup;
  addDateText: string = 'Datum hinzufügen';
  expenseDate: Date = new Date();
  vehicle: Vehicle;
  intervalTypes: Interval;

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
    this.intervalTypes = this.getIntervalTypes();
  }

  getIntervalTypes() {
    return Object.keys(Interval).map((key: string) => {
      return Interval[key];
    });
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

    this.dispatchExpense(expense);
    this.resetForm();
    this.router.navigate(['/expenselist/' + this.vehicle.id , {outlets: {'expenseform': null}}]);
  }

  dispatchExpense(expense: Expense) {
    let getIdFn = this.idGenerator.getId.bind(this);
    let date = expense.date;
    let month = date.getMonth();
    let year = date.getFullYear();

    switch (expense.interval) {
      case Interval.TYPE_NEVER:
        this.ngRedux.dispatch(this.vehicleActions.addExpense(expense));
        return;

      case Interval.TYPE_MONTHLY:
        for (let i = month; i < 12; i++) {
          let newExpense = Object.assign({}, expense, {
            id: getIdFn(),
            date: new Date(date.getFullYear(), i, date.getDate())
          });
          this.ngRedux.dispatch(this.vehicleActions.addExpense(newExpense));
        }
        return;

      case Interval.TYPE_YEARLY:
        for (let i = year; i < year+10; i++) {
          let newExpense = Object.assign({}, expense, {
            id: getIdFn(),
            date: new Date(i, date.getMonth(), date.getDate())
          });
          this.ngRedux.dispatch(this.vehicleActions.addExpense(newExpense));
        }
        return;
    }

  }

  createModel(formValue, id, vehicleId): Expense {
    return {
      ...formValue,
      id: id,
      vehicleId: vehicleId
    };
  }

  onIntervalSelectChange(intervalType: Interval) {

  }
}
