import { VehicleActions } from '../app/app.actions';
import { getIndex } from '../services/get-index';
import { IAppState } from '../store';
import { Payload } from '../models/payload';

export function expenseList(lastState: IAppState, action : Payload) : IAppState {
    switch (action.type) {
        case VehicleActions.ADD_EXPENSE : 
            return Object.assign({}, lastState, {
                expenseList: [...lastState.expenseList, action.payload]
            });

        case VehicleActions.DELETE_EXPENSE : 
            const expenseIndexToDelete = getIndex(lastState.expenseList, action.payload);
            
            if (expenseIndexToDelete > -1) {
                return Object.assign({}, lastState, {
                    expenseList: [
                        ...lastState.expenseList.slice(0, expenseIndexToDelete),
                        ...lastState.expenseList.slice(expenseIndexToDelete + 1)
                    ]
                });
            }
            throw Error(`Expense cannot be deleted. Expense with id ${action.payload.id} not found`);
    }

    return lastState;
}