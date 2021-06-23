import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  duration: number = 30000;

  constructor(public snackBar: MatSnackBar) { }

  successMessage(message: string) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: this.duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['msg-success'],
      data: { message: message, icon: 'check' }
    });
  }

  errorMessage(message: string) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: this.duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['msg-error'],
      data: { message: message, icon: 'priority_high' }
    });
  }

  warningMessage(message: string) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: this.duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['msg-warning'],
      data: { message: message, icon: 'warning' }
    });
  }

}
