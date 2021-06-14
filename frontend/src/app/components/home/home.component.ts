import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public showClientForm: boolean = false;
  public clientsCount: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  openClientForm(): void {
    this.showClientForm = true;
  }

  closeClientForm(event: boolean): void {
    this.showClientForm = false;
  }

  addClientForm(event: boolean): void {
    this.clientsCount++;
  }
}
