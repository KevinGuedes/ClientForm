import { v4 as newGuid } from 'uuid';

export class Account {
    id: string;

    constructor() {
        this.id = newGuid();
    }
}
