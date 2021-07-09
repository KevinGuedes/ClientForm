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
  public clientsForm: FormGroup = this.formBuilder.group({
    clients: this.formBuilder.array([])
  })
  public clientTypes = ClientType;

  constructor(
    private clientService: ClientService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) { }

  get roleKeys(): string[] {
    return Object.keys(this.clientTypes).filter(k => !isNaN(Number(k)))
  }

  get roles(): typeof ClientType {
    return this.clientTypes;
  }

  get hasMultipleOwnersError(): boolean {
    return this.clients.value.map((client: any) => client.type).filter((value: ClientType) => value == ClientType.Owner).length > 1;
  }

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

  saveClient(): void {
    this.clients.markAllAsTouched();

    if (this.clients.value.map((client: any) => client.type).every((value: ClientType) => value == ClientType.Holder)) {
      this.snackBarService.warningMessage("Only one member can be the Account Owner")
      return;
    }

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
      await sleepForSeconds();

      await this.clientService.insert(client)
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
      this.snackBarService.successMessage("Client successfully registered")
      this.registerSucceeded.emit(
        {
          ownerName: clients.filter((client: any) => client.type == ClientType.Owner).shift().name,
          success: true
        }
      );
    }
  }

  private calculateSpinnerPercentage(actual: number, total: number): void {
    this.spinnerPercentage = (actual / total) * 100;
  }
}
