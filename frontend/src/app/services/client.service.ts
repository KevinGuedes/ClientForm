import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
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

  insert(client: Client): Promise<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      map(c => c),
      catchError(error => this.errorHandler(error))
    ).toPromise();
  }

  errorHandler(error: any): Observable<any> {
    this.snackBarService.errorMessage("Back-end went rogue, sorry!")
    return throwError(error)
  }
}
