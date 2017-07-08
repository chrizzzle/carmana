import {Component} from '@angular/core';
import { Vehicle } from '../../models/vehicle';
import { Expense } from '../../models/expense';
import { NgRedux } from '@angular-redux/store';
import { IAppState} from '../../store';
import { VehicleActions } from '../../app/app.actions';
import {Params, ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IdGeneratorService } from '../../services/id-generator';
import { DateFormat } from '../../services/date-format';
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
    showExpenseEdit : Boolean = false;
    addDateText: string = 'Datum hinzufügen';
    expenseTypes: Array<any>;

    public constructor(
        private ngRedux : NgRedux<IAppState>,
        private route : ActivatedRoute,
        private vehicleActions : VehicleActions,
        private router: Router
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

      this.ngRedux.select('vehicles')
            .withLatestFrom(this.route.params, (vehicles : Vehicle[], params : Params) => vehicles
                    .find(vehicle => vehicle.id === params['vehicleId'])).subscribe((vehicle : Vehicle) => {
            this.vehicle = Object.assign({}, vehicle);
        });

        this.expenseTypes = this.getExpenseTypes();
    }

    onExpenseAddTap() {
        this.showExpenseEdit = !this.showExpenseEdit;
    }

    getExpenseTypes() {
        return Object.keys(ExpenseType).map((key: string) => {
          return ExpenseType[key];
        });
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

    onExpenseFormSelectChange(expenseType) {
      console.log(expenseType, ExpenseType.TYPE_CREDIT);
        switch (expenseType) {
          case ExpenseType.TYPE_CREDIT:
            this.router.navigate(['/expenselist/' + this.vehicle.id , {outlets: {'expenseform': ['credit-form']}}]);
            return;
          case ExpenseType.TYPE_FUEL:
            this.router.navigate(['/expenselist/' + this.vehicle.id , {outlets: {'expenseform': ['fuel-form']}}]);
            return;
          case ExpenseType.TYPE_INSURANCE:
            this.router.navigate(['/expenselist/' + this.vehicle.id , {outlets: {'expenseform': ['insurance-form']}}]);
            return;
          case ExpenseType.TYPE_LEASING:
            this.router.navigate(['/expenselist/' + this.vehicle.id , {outlets: {'expenseform': ['leasing-form']}}]);
            return;
          case ExpenseType.TYPE_REPAIR:
            this.router.navigate(['/expenselist/' + this.vehicle.id , {outlets: {'expenseform': ['repair-form']}}]);
            return;
        }
    }
}
