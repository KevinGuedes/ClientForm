import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  @Output("close") closeClientForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output("add") addClientForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  public client: Client;

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.client = {
      name: '',
      email: '',
      birth: null,
      city: '',
      country: '',
      mother: ''
    }
  }

  closeForm(): void {
    this.closeClientForm.emit(true)
  }

  addForm(): void {
    this.addClientForm.emit()
  }

  showClient(): void {

    const isValidClient = this.clientService.validateClient(this.client);
    if (true) {
      this.clientService.insert(this.client);
    }
    else
      console.error("Invalid Client entity")

  }

}
