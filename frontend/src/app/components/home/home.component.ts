import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public showClientForm: boolean = false;
  public showWelcomeMessage: boolean = false;
  public client: Client;

  constructor() { }

  ngOnInit(): void {
  }

  openClientForm(): void {
    this.showClientForm = true;
  }

  closeClientForm(event: boolean): void {
    this.showClientForm = false;
  }

  welcomeMessage(event: any): void {
    this.client = event.client;
    this.showWelcomeMessage = true;
    this.showClientForm = false;
  }
}
