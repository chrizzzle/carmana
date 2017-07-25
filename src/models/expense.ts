import {ExpenseType} from "./expense-type";
import {Interval} from './expense-type/interval';

export class Expense {
    id: string;
    type: ExpenseType;
    date: Date;
    amount: number;
    vehicleId: string;
    interval: Interval;
}
