import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Expense } from '../../models/expense';
import 'chart.js';
import 'rxjs/add/operator/pluck'; 
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/mergeMap'; 
import 'rxjs/add/operator/groupBy'; 
import 'rxjs/observable/range'; 

@Component({
    templateUrl: 'statistics.html'
})
export class StatisticsPage {
    private expenseAmounts$ : Observable<number[]>;
    private expenseDates$ : Observable<Date[]>;
    
    months : Array<string>;
    amountByMonth : Array<number>;
    totalAmount : number;

    public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
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
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  constructor(
      private ngRedux : NgRedux<IAppState>,
      private route: ActivatedRoute
  ) {
      
  }

  ngOnInit() {
    this.expenseDates$ = this.pluckExpenses('date', (date : string) : Date => new Date(date));
    this.expenseAmounts$ = this.pluckExpenses('amount');
  
    this.months = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];

    
    this.expensesByVehicle().subscribe((expenses: Expense[]) => {
      this.amountByMonth = this.months.map((month : string) => {
        return expenses.reduce((acc : number, expense : Expense ) => {
            const date = new Date(expense.date);
            if (date.getMonth() === Number(month)) {
              acc += Number(expense.amount);
            }
            return acc;
        }, 0);
      });

      this.lineChartData = [{
        data: this.amountByMonth,
        label: 'Ausgaben'
      }];

      this.totalAmount = expenses.reduce((acc : number, expense : Expense) => acc + Number(expense.amount), 0);
    });
  }

  

  expensesByVehicle() {
    return this.route.params.switchMap((params : Params) => this.ngRedux
      .select('expenseList')
      .map((expenses : Expense[]) => expenses
        .filter(expense => expense.vehicleId === params['vehicleId'])));
  }

  pluckExpenses(prop : string, transform : Function = (item) => item) : Observable<any[]> {
    return this.expensesByVehicle().map((expenses : Expense[]) => expenses.reduce((acc, expense) => {
        acc.push(transform(expense[prop]));
        return acc;
      }, []));
  }
}