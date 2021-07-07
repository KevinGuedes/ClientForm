export class Client {
    id?: number;
    name: string;
    email: string;
    birth: Date;
    country: string;
    city: string;
    mother: string;

    constructor(data?: any) {
        this.name = data.name;
        this.email = data.email;
        this.birth = data.birth;
        this.country = data.country;
        this.city = data.city;
        this.mother = data.mother;
    }
}
