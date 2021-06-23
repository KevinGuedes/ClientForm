import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Client } from '../models/client.model';
import { environment } from 'src/environments/environment'
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl: string = environment.clientApiUrl;

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
  ) { }

  insert(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      map(c => c),
      catchError(error => this.errorHandler(error))
    );
  }

  errorHandler(error: any): Observable<any> {
    this.snackBarService.errorMessage("Back-end went rogue! Sorry!")
    return EMPTY
  }
}
