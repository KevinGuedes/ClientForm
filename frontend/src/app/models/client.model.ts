import { Account } from "./account.model";
import { ClientType } from "./Enums/client-type.enum";

export class Client {
    id?: number;
    name: string;
    email: string;
    birth: Date;
    country: string;
    city: string;
    mother: string;
    type: ClientType;
    account: Account;

    constructor(data: any, account: Account) {
        this.name = data.name;
        this.email = data.email;
        this.birth = data.birth;
        this.country = data.country;
        this.city = data.city;
        this.mother = data.mother;
        this.type = data.type;
        this.account = account;
    }
}
