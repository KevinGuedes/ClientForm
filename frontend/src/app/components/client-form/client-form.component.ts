import { ClientType } from 'src/app/models/Enums/client-type.enum';
import { Component, OnInit, AfterContentChecked, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormArray, AbstractControl, FormGroup } from '@angular/forms';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { AgeValidator } from 'src/app/tools/validators/ageValidator';
import { MatDialog } from '@angular/material/dialog';
import { RegisterConfirmationComponent } from 'src/app/components/dialogs/register-confirmation/register-confirmation.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { sleepForSeconds } from 'src/app/tools/sleepForSeconds';
import { Account } from 'src/app/models/account.model';

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
  public clientsForm: FormGroup = this._formBuilder.group({
    clients: this._formBuilder.array([])
  })
  public clientTypes = ClientType;

  constructor(
    private _clientService: ClientService,
    private _snackBarService: SnackBarService,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _cdRef: ChangeDetectorRef
  ) { }

  public get roleKeys(): string[] {
    return Object.keys(this.clientTypes).filter(key => !isNaN(Number(key)))
  }

  public get roles(): typeof ClientType {
    return this.clientTypes;
  }

  public get hasMultipleOwnersError(): boolean {
    return this.clients.value.map((client: any) => client.type).filter((value: ClientType) => value == ClientType.Owner).length > 1;
  }

  public get hasNoOwnerError(): boolean {
    const controls: AbstractControl[] = this.clients.controls.map(element => element['controls'])
    const key: string = "type";

    const roleFieldsValid: boolean = controls.map(element => element[key].valid).every(value => value == true);
    const hasNoOwner: boolean = controls.map(element => element[key].value != ClientType.Owner).every(value => value == true);

    return roleFieldsValid && hasNoOwner;
  }

  public get clients(): FormArray {
    return this.clientsForm.controls["clients"] as FormArray;
  }

  public get showErrorMessage(): boolean {
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

  public get spinnerProgress(): number {
    return this.spinnerPercentage
  }

  ngOnInit(): void {
    this.addClient()
  }

  closeForm(): void {
    this.closeClientsForm.emit(true)
  }

  ngAfterContentChecked(): void {
    this._cdRef.detectChanges();
  }

  removeClient(index: number): void {
    this.clients.removeAt(index)

    if (!this.clients.value.length)
      this.closeClientsForm.emit(true)
  }

  addClient(): void {
    const clientForm = this._formBuilder.group({
      name: new FormControl(null, [
        Validators.minLength(3),
      ]),
      mother: new FormControl(null, [
        Validators.required,
      ]),
      email: new FormControl(null, [
        Validators.email,
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
      type: new FormControl(null, [
        Validators.required,
      ])
    })

    this.clients.push(clientForm);
  }

  createNewAccount(): void {
    this.clients.markAllAsTouched();
    const newAccount: Account = new Account();
    const clients: Client[] = this.clients.value.map((client: any) => new Client(client, newAccount));

    this._dialog
      .open(RegisterConfirmationComponent, { panelClass: "dialog-confirmation", data: { clients }, autoFocus: false })
      .afterClosed().subscribe(dataConfirmed => {
        if (dataConfirmed) {
          this.isSubmited = true;
          this.registerClients(clients, newAccount);
        }
        else
          this._snackBarService.warningMessage("Double check the provided data")
      })
  }

  private async registerClients(clients: Client[], account: Account): Promise<void> {
    let clientsRegistered: number = 0;
    let registerSucceeded: boolean = false;

    for (let client of clients) {
      await sleepForSeconds();

      await this._clientService.insert(client)
        .then(data => {
          this.calculateSpinnerPercentage(++clientsRegistered, clients.length)
          registerSucceeded = true;
        })
        .catch(error => {
          console.error(error.message)
          this.isSubmited = false;
          registerSucceeded = false;
        })
    }

    if (registerSucceeded) {
      await sleepForSeconds();
      this._snackBarService.successMessage("Client successfully registered")
      this.registerSucceeded.emit(
        {
          owner: this._clientService.getAccountOwner(clients),
          success: true,
          account: account
        }
      );
    }
  }

  private calculateSpinnerPercentage(actual: number, total: number): void {
    this.spinnerPercentage = (actual / total) * 100;
  }
}
