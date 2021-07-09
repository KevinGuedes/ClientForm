import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from 'src/app/models/client.model';
import { ClientType } from 'src/app/models/Enums/client-type.enum';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.css']
})
export class RegisterConfirmationComponent implements OnInit {

  public readonly clientTypes: ClientType;

  constructor(
    public dialogRef: MatDialogRef<RegisterConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      clients: Client[]
    }
  ) { }

  public getClientTypeName(type: ClientType): string {
    return ClientType[type];
  }

  ngOnInit(): void {
  }
}
