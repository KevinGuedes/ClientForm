import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from 'src/app/models/client.model';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.css']
})
export class RegisterConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RegisterConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      client: Client
    }
  ) { }

  ngOnInit(): void {
  }
}