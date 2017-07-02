import { Component } from '@angular/core';
import { Vehicle } from '../../models/vehicle';
import { Expense } from '../../models/expense';
import { NgRedux } from '@angular-redux/store';
import { IAppState} from '../../store';
import { VehicleActions } from '../../app/app.actions';
import { Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IdGeneratorService } from '../../services/id-generator';
import { DateFormat } from '../../services/date-format';
import { Platform } from 'ionic-angular';
import { DatePicker } from 'ionic-native';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/merge';
import {ExpenseType} from "../../models/expense-type";

@Component({
    templateUrl: './expenselist.html',
    providers: [
        IdGeneratorService,
        DateFormat
    ]
})
export class ExpenseListPage {
    private vehicle : Vehicle;
    expenses$ : Observable<Expense[]>;
    newExpense : FormGroup;
    showExpenseEdit : Boolean = false;
    addDateText: string = 'Datum hinzufügen';

    public constructor(
        private ngRedux : NgRedux<IAppState>,
        private route : ActivatedRoute,
        private vehicleActions : VehicleActions,
        private idGenerator : IdGeneratorService,
        private platform : Platform,
        private formBuilder : FormBuilder
    ) { 
        this.expenses$ = this.ngRedux.select('expenseList')
        .withLatestFrom(this.route.params, ( expenses : Expense[], params : Params) => expenses
                .filter((expense : Expense) => expense.vehicleId === params['vehicleId'])
                .sort((expense1: Expense, expense2 : Expense) => {
                    if (expense1.date > expense2.date) return -1;
                    if (expense1.date === expense2.date) return 0;
                    if (expense1.date < expense2.date) return 1;
                })
        );

        this.route.params
            .withLatestFrom(this.ngRedux
                .select('vehicles'), (params : Params, vehicles : Vehicle[]) => vehicles
                    .find(vehicle => vehicle.id === params['vehicleId'])).subscribe((vehicle : Vehicle) => {
            this.vehicle = Object.assign({}, vehicle);
        });

        this.newExpense = this.formBuilder.group({
            type: ['', Validators.required],
            amount: [0, Validators.required],
            mileage: [this.vehicle.mileage, Validators.required],
            date: ['', Validators.required]
        });
    }

    onExpenseAddTap() {
        this.showExpenseEdit = !this.showExpenseEdit;

        if (this.showExpenseEdit) {
            this.addDateText = 'Datum hinzufügen';
        }
    }

    insertDate (date) {
        this.addDateText = DateFormat.formatGermanDate(date);
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

        DatePicker.show({
            date: new Date(),
            mode: 'date',
        }).then(
            insertDateFn,
            err => console.log('Error occurred while getting date: ', err)
        );
    }

    onNewExpenseTap() {
        const getIdFn = this.idGenerator.getId.bind(this);
        const vehicleId = this.vehicle.id;
        const formValue = this.newExpense.value;

        let expense : Expense = {
            id: getIdFn(),
            vehicleId: vehicleId,
            type: formValue.type,
            date: formValue.date,
            mileage: formValue.mileage,
            amount: formValue.amount
        };

        console.log(expense);
        this.ngRedux.dispatch(this.vehicleActions.addExpense(expense));
        this.showExpenseEdit = !this.showExpenseEdit;
    }

    expenseTypes() {
        let expenseTypes = new ExpenseType();
        console.log(Object.keys(expenseTypes));

        return Object.keys(expenseTypes);
    }

    formatGermanDate(date) {
        if (Boolean(date) && typeof(date) === 'string') {
            date = new Date(date);
        }
        return DateFormat.formatGermanDate(date);
    }

    onExpenseDeleteTap(expense : Expense) {
        this.ngRedux.dispatch(this.vehicleActions.deleteExpense(expense));
    }
}