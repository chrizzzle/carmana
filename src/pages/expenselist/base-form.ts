import {DatePicker} from '@ionic-native/date-picker';
import {DateFormat} from '../../services/date-format';
import {Platform} from 'ionic-angular';
import {ActivatedRoute} from '@angular/router';
import {Vehicle} from '../../models/vehicle';
import {FormGroup} from '@angular/forms';


export abstract class BaseForm {
  newExpenseGroup : FormGroup;
  addDateText: string = 'Datum hinzufügen';
  expenseDate: Date = new Date();
  vehicle: Vehicle;

  constructor(
    private datePicker: DatePicker,
    private platform: Platform,
    private activatedRoute: ActivatedRoute
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
}
