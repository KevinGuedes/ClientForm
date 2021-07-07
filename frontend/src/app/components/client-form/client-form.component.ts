import { Component, OnInit, AfterContentChecked, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
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

  public spinnerPercentage: number = 0;
  public isSubmited: boolean = false;
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

  get showErrorMessage() {
    const controls: AbstractControl[] = this.clients.controls.map(element => element['controls'])

    let showErrorMessage: boolean[] = controls.map(element => {
      let keys: string[] = Object.keys(element)

      for (let key of keys) {
        if (element[key].touched && element[key].invalid)
          return true;
      }

      return false
    })

    return showErrorMessage.some(value => value == true)
  }

  get spinnerProgress() {
    return this.spinnerPercentage
  }

  ngOnInit(): void {
    this.addClient()
  }

  closeForm(): void {
    this.closeClientsForm.emit(true)
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  removeClient(index: number): void {
    this.clients.removeAt(index)

    if (!this.clients.value.length)
      this.closeClientsForm.emit(true)
  }

  addClient(): void {
    const clientForm = this.formBuilder.group({
      name: new FormControl("kevin", [
        Validators.minLength(3)
      ]),
      mother: new FormControl("kevin", [
        Validators.required,
      ]),
      email: new FormControl("kevin@mail.com", [
        Validators.email
      ]),
      country: new FormControl("kevin", [
        Validators.required,
      ]),
      city: new FormControl("kevin", [
        Validators.required,
      ]),
      birth: new FormControl(null, [
        Validators.required,
        AgeValidator
      ]),
    })
    this.clients.push(clientForm);
  }

  saveClient(): void {
    this.clients.markAllAsTouched();
    const clients: Client[] = this.clients.value.map((client: any) => new Client(client));

    this.dialog
      .open(RegisterConfirmationComponent, { panelClass: "dialog-confirmation", data: { clients }, autoFocus: false })
      .afterClosed().subscribe(dataConfirmed => {
        if (dataConfirmed) {
          this.isSubmited = true;
          this.registerClients(clients);
        }
        else
          this.snackBarService.warningMessage("Double check the provided data")
      })
  }

  private async registerClients(clients: Client[]): Promise<void> {
    let clientsRegistered: number = 0;
    let registerSucceeded: boolean = false;

    for (let client of clients) {
      await this.sleepForSeconds();

      await this.clientService.insert(client)
        .then(data => {
          clientsRegistered++;
          this.calculateSpinnerPercentage(clientsRegistered, clients.length)
          registerSucceeded = true;
        })
        .catch(error => {
          console.error(error.message)
          this.isSubmited = false;
          registerSucceeded = false;
        })
    }

    if (registerSucceeded) {
      await this.sleepForSeconds();
      this.snackBarService.successMessage("Client successfully registered")
      this.registerSucceeded.emit({ client: clients, success: true });
    }
  }

  private calculateSpinnerPercentage(actual: number, total: number): void {
    this.spinnerPercentage = (actual / total) * 100;
  }

  private sleepForSeconds(seconds: number = 0.5): Promise<any> {
    //Yes, this function was made just foy you to see my beautiful spinner progress
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
}
