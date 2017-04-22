import { Injectable } from '@angular/core';

@Injectable()
export class DateFormat {
    static formatGermanDate(date : Date) {
        if (!Boolean(date)) {
            return '';
        }
        
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }
}