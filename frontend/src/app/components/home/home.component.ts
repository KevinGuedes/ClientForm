import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account.model';
import { Client } from 'src/app/models/client.model';
import { ClientType } from 'src/app/models/Enums/client-type.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public showClientForm: boolean = false;
  public showWelcomeMessage: boolean = false;
  private owner: Client;
  private account: Account;

  constructor() { }

  ngOnInit(): void {
  }

  public get ownerName() {
    return this.owner.name;
  }

  public get accountId() {
    return this.account.id;
  }

  openClientForm(): void {
    this.showClientForm = true;
  }

  closeClientForm(event: boolean): void {
    this.showClientForm = false;
  }

  welcomeMessage(event: any): void {
    this.owner = event.owner;
    this.account = event.account;
    this.showWelcomeMessage = true;
    this.showClientForm = false;
  }
}
