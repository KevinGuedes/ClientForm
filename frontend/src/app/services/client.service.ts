import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Client } from '../models/client.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl: string = "http://localhost:3004/clients";

  constructor(
    private http: HttpClient,
  ) { }

  validateClient(client: Client): boolean {
    return Object.values(client).map(value => !!value).every(value => value == true)
  }

  insert(client: Client): Observable<Client> {
    console.log(client.birth);
    return this.http.post<Client>(this.apiUrl, client, httpOptions).pipe(
      map(c => c),
      catchError(error => this.errorHandler(error))
    );
  }

  errorHandler(error: any): Observable<any> {
    console.error(error);
    return EMPTY;
  }
}
