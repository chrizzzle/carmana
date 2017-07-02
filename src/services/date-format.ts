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

    static createRandomDate(past : Boolean = true) {
        const current = new Date();
        const oneDay=1000*60*60*24;
        const rnd = Math.random() * 100;
        let object = oneDay * rnd;
        object = past ? object * (-1) : object;
        const newTime = current.getTime() + object;

        return new Date(newTime);
    }

    static createRandomDatePast() {
        return DateFormat.createRandomDate();
    }

    static createRandomDateFuture() {
        return DateFormat.createRandomDate(false);
    }
}