import { Injectable } from '@angular/core';

@Injectable()
export class IdGeneratorService {
    getId(): string {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}