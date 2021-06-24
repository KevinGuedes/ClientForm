import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { AgeValidator } from 'src/app/tools/validators/ageValidator';
import { MatDialog } from '@angular/material/dialog';
import { RegisterConfirmationComponent } from 'src/app/components/dialogs/register-confirmation/register-confirmation.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  @Output("close") closeClientForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output("success") registerSucceeded: EventEmitter<any> = new EventEmitter<any>();

  public client: Client = new Client();
  public clientForm: FormGroup;
  public isRegistering: boolean = false;

  constructor(
    private clientService: ClientService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog
  ) { }

  get formControl() {
    return this.clientForm.controls;
  }

  ngOnInit(): void {
    this.clientForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      mother: new FormControl(null, [
        Validators.required,
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      country: new FormControl(null, [
        Validators.required,
      ]),
      city: new FormControl(null, [
        Validators.required,
      ]),
      birth: new FormControl(null, [
        Validators.required,
        AgeValidator
      ]),
    })
  }

  closeForm(): void {
    this.closeClientForm.emit(true)
  }

  saveClient(): void {
    const client: Client = new Client(this.clientForm.value.name, this.clientForm.value.email, this.clientForm.value.birth, this.clientForm.value.country, this.clientForm.value.city, this.clientForm.value.mother)

    if (this.clientForm.valid) {

      this.dialog
        .open(RegisterConfirmationComponent, { width: "40%", data: { client } })
        .afterClosed().subscribe(dataConfirmed => {

          if (dataConfirmed) {
            this.isRegistering = true;

            this.clientService.insert(client).subscribe(() => {
              this.snackBarService.successMessage("Client successfully registered")
              this.registerSucceeded.emit({ client: client, success: true });
              this.isRegistering = false;
            });
          }
          else {
            this.snackBarService.warningMessage("Double check the provided data")
          }

        })

    }
  }
}
