import { Component, OnInit, AfterViewInit, AfterContentChecked, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl, FormGroupDirective } from '@angular/forms';
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
export class ClientFormComponent implements OnInit, AfterContentChecked {

  @Output("close") closeClientsForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output("success") registerSucceeded: EventEmitter<any> = new EventEmitter<any>();

  public isRegistering: boolean = false;
  public disabled: boolean;
  public clientsForm = this.formBuilder.group({
    clients: this.formBuilder.array([])
  })

  constructor(
    private clientService: ClientService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) { }

  get clients() {
    return this.clientsForm.controls["clients"] as FormArray;
  }

  ngOnInit(): void {
    this.addClient()
  }

  closeForm(): void {
    this.closeClientsForm.emit(true)
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  removeClient(index: number): void {
    this.clients.removeAt(index)

    if (!this.clients.value.length)
      this.closeClientsForm.emit(true)
  }

  addClient(): void {
    const clientForm = this.formBuilder.group({
      name: new FormControl(null, [
        Validators.minLength(3)
      ]),
      mother: new FormControl(null, [
        Validators.required,
      ]),
      // email: new FormControl(null, [
      //   Validators.email
      // ]),
      // country: new FormControl(null, [
      //   Validators.required,
      // ]),
      // city: new FormControl(null, [
      //   Validators.required,
      // ]),
      // birth: new FormControl(null, [
      //   Validators.required,
      //   AgeValidator
      // ]),
    })
    this.clients.push(clientForm);
  }

  saveClient(allClientsForm: FormGroupDirective): void {
    allClientsForm.form.markAllAsTouched();
    console.log(this.clients)
    const { clients } = allClientsForm.value;
    console.log(clients)
    //   const client: Client = new Client(this.clientForm.value.name, this.clientForm.value.email, this.clientForm.value.birth, this.clientForm.value.country, this.clientForm.value.city, this.clientForm.value.mother)

    //   if (this.clientForm.valid) {

    //     this.dialog
    //       .open(RegisterConfirmationComponent, { width: "40%", data: { client } })
    //       .afterClosed().subscribe(dataConfirmed => {

    //         if (dataConfirmed) {
    //           this.isRegistering = true;

    //           this.clientService.insert(client).subscribe(() => {
    //             this.snackBarService.successMessage("Client successfully registered")
    //             this.registerSucceeded.emit({ client: client, success: true });
    //             this.isRegistering = false;
    //           });
    //         }
    //         else {
    //           this.snackBarService.warningMessage("Double check the provided data")
    //         }

    //       })

    //   }
  }
}
