import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  @Output("close") closeClientForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  public client: Client = new Client();
  public clientForm: FormGroup;
  private currentDate: Date = new Date();

  constructor(
    private clientService: ClientService
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
      ]),
    })
  }

  closeForm(): void {
    this.closeClientForm.emit(true)
  }

  saveClient(): void {
    const client: Client = new Client(this.clientForm.value.name, this.clientForm.value.email, this.clientForm.value.birth, this.clientForm.value.country, this.clientForm.value.city, this.clientForm.value.mother)

    const isValidClient = this.clientService.validateClient(client);

    if (isValidClient)
      this.clientService.insert(client).subscribe(() => {
        console.log("Client successfully registered")
      });
    else
      console.error("Invalid Client entity")
  }

}
