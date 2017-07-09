import {Component} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../../store';
import {Params, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Expense} from '../../models/expense';
import 'chart.js';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/groupBy';
import 'rxjs/observable/range';
import {ExpenseType} from '../../models/expense-type';

@Component({
  templateUrl: 'statistics.html'
})
export class StatisticsPage {
  private expenseAmounts$: Observable<number[]>;
  private expenseDates$: Observable<Date[]>;
  private expensesByVehicle: Expense[];

  months: Array<number>;
  amountByMonth: Array<number>;
  totalAmount: number;
  expenseTypes: ExpenseType[];

  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public doughnutChartLabels: ExpenseType[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType: string = 'doughnut';

  constructor(private ngRedux: NgRedux<IAppState>,
              private activatedRoute: ActivatedRoute) {
    this.expensesByVehicle = this.activatedRoute.snapshot.data['expenses'];
    // this.expenseDates$ = this.pluckExpenses('date', (date : string) : Date => new Date(date));
    // this.expenseAmounts$ = this.pluckExpenses('amount');
    console.log(this.expensesByVehicle);

    this.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.expenseTypes = this.getExpenseTypes();

    this.expenseTypes.forEach((expenseType: ExpenseType) => {
      let amountByTypeAndMonth = this.expensesByType(expenseType, this.expensesByVehicle);
      this.lineChartData.push({
        data: amountByTypeAndMonth,
        label: expenseType
      });

      this.doughnutChartData.push(this.getSum(amountByTypeAndMonth));
      this.doughnutChartLabels.push(expenseType);
    });

    this.totalAmount = this.expensesByVehicle.reduce((acc: number, expense: Expense) => acc + Number(expense.amount), 0);
  }

  ngOnInit() {

  }

  getSum(arr: number[]) {
    return arr.reduce((acc: number, val: number) => {
      return acc + val;
    }, 0)
  }

  getExpenseTypes(): ExpenseType[] {
    return Object.keys(ExpenseType).map((key: string) => {
      return ExpenseType[key];
    });
  }

  expensesByMonth(monthIndex: number, expenses: Expense[]): Expense[] {
    return expenses.filter((expense: Expense) => {
      let date = new Date(expense.date);
      return date.getMonth() === monthIndex;
    })
  }

  expensesByType(type: ExpenseType, expenses: Expense[]): number[] {
    return expenses.reduce((acc: any, expense: Expense) => {
      if (expense.type !== type) {
        return acc;
      }

      let date = new Date(expense.date);
      let index = date.getMonth();

      acc[index] += Number(expense.amount);
      return acc;
    }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
  }

  // pluckExpenses(prop : string, transform : Function = (item) => item) : Observable<any[]> {
  //   return this.expensesByVehicle.map((expenses : Expense[]) => expenses.reduce((acc, expense) => {
  //       acc.push(transform(expense[prop]));
  //       return acc;
  //     }, []));
  // }
}
