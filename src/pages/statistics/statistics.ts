import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Expense} from '../../models/expense';
import 'chart.js';
import {ExpenseType} from '../../models/expense-type';

@Component({
  templateUrl: 'statistics.html'
})
export class StatisticsPage {
  private expensesByVehicle: Expense[];

  months: Array<number>;
  totalAmount: number;
  expenseTypes: ExpenseType[];
  expenseTypeFns;
  years: number[];
  graphType: string;
  currentYear: number;

  public lineChartData: Array<{data: number[], label: string|ExpenseType}> = [];
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';


  public barChartLabels:string[] = ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  public barChartLegend:boolean = true;
  public barChartType: string = 'bar';
  public barChartData: any[] = [
  ];
  public barChartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        },
        stacked: true
      }]
    }
  };


  public doughnutChartLabels: ExpenseType[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType: string = 'doughnut';

  constructor(private activatedRoute: ActivatedRoute) {
    this.expensesByVehicle = this.activatedRoute.snapshot.data['expenses'];
    this.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.years = this.getYearsGrouped(this.expensesByVehicle);
    this.expenseTypes = this.getExpenseTypes();
    this.graphType = 'bar';

    if (this.years.length > 0) {
      this.getData(this.years[0]);
    }
  }

  getSum(arr: number[]) {
    return arr.reduce((acc: number, val: number) => {
      return acc + val;
    }, 0)
  }

  getYearsGrouped(expenses: Expense[]): number[] {
    return expenses.reduce((acc: number[], expense: Expense) => {
      let date = new Date(expense.date);
      let year = date.getFullYear();

      if (acc.indexOf(year) > -1) {
        return acc;
      }

      acc.push(year);

      return acc;
    }, [])
  }

  getExpenseTypeFns(year: number) {
    let expenseTypes = this.getExpenseTypes();
    let expenseTypeFns = {};

    expenseTypes.forEach((expenseType: ExpenseType) => {
      expenseTypeFns['' + expenseType] = this.getExpenseTypeFn(expenseType, year);
    });

    return expenseTypeFns;
  }

  getExpenseTypeFn(expenseType: ExpenseType, year: number) {
    return this.expensesByType.bind(this, expenseType, this.expensesByVehicle, year);
  }

  getExpenseTypes(): ExpenseType[] {
    return Object.keys(ExpenseType).map((key: string) => {
      return ExpenseType[key];
    });
  }

  expensesByType(type: ExpenseType, expenses: Expense[], year: number): number[] {
    return expenses.reduce((acc: any, expense: Expense) => {
      if (expense.type !== type) {
        return acc;
      }

      let date = new Date(expense.date);

      if (year !== date.getFullYear()) {
        return acc;
      }

      let index = date.getMonth();

      acc[index] += Number(expense.amount);
      return acc;
    }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
  }

  allExpensesByMonth(expenses: Expense[], year: number): number[] {
    return expenses.reduce((acc: any, expense: Expense) => {
        let date = new Date(expense.date);

        if (date.getFullYear() !== year) {
          return acc;
        }

        let monthIndex = date.getMonth();
        acc[monthIndex] += Number(expense.amount);
        return acc;
      }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
  }

  onExpenseTypeSelectChange(expenseType: ExpenseType) {
    this.lineChartData = [{
      data: this.expenseTypeFns['' + expenseType](),
      label: expenseType
    }];
  }

  onYearSelectChange(year) {
    this.currentYear = year;
    this.getData(year);
  }

  onGraphTypeSelectChange(graph) {
    this.getData(this.currentYear || this.years[0]);
    this.graphType = graph;
  }

  getDoughnutData(expenseTypes: ExpenseType[], fullYear: number): {data: number[], labels: string[]} {
    let data: number[] = [];
    let labels: string[] = [];
    expenseTypes.forEach((expenseType: ExpenseType) => {
      let amountByTypeAndMonth = this.expensesByType(expenseType, this.expensesByVehicle, fullYear);
      let sum = this.getSum(amountByTypeAndMonth);

      if (sum > 0) {
        data.push(sum);
        labels.push('' + expenseType);
      }
    });

    return {
      data: data,
      labels: labels
    };
  }

  getLineChartData(expensesByVehicle: Expense[], fullYear: number): Array<{data: number[], label: string}> {
    return [{
      data: this.allExpensesByMonth(expensesByVehicle, fullYear),
      label: 'Alle'
    }];
  }

  getBarChartData(): Array<{data: number[], label: string, stack: string}> {
    let result = [];
    for (let i in this.expenseTypeFns) {
      if (this.expenseTypeFns.hasOwnProperty(i)) {
        let fn = this.expenseTypeFns[i];
        let sum = this.getSum(fn());

        if (sum > 0) {
          result.push({
            data: fn(),
            label: i,
            stack: '1'
          });
        }
      }
    }

    return result;
  }

  getData(year) {
    let fullYear = Number(year);
    let doughnutData = this.getDoughnutData(this.expenseTypes, fullYear);

    this.doughnutChartData = doughnutData.data;
    this.doughnutChartLabels = doughnutData.labels;

    this.expenseTypeFns = this.getExpenseTypeFns(fullYear);
    this.barChartData = this.getBarChartData();

    this.expenseTypeFns['Alle'] = this.allExpensesByMonth.bind(this, this.expensesByVehicle, fullYear);
    this.lineChartData = this.getLineChartData(this.expensesByVehicle, fullYear);

    this.totalAmount = this.expensesByVehicle.reduce((acc: number, expense: Expense) => acc + Number(expense.amount), 0);
  }
}
