import {ExpenseType} from "./expense-type";

export class Expense {
    id: string;
    type: ExpenseType;
    date: Date;
    amount: number;
    vehicleId: string;
    mileage: number;
}
