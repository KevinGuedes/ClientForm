import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public showClientForm: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openClientForm(): void {
    this.showClientForm = true;

    let now = new Date();
    let age = now.getFullYear();

    console.log(age)
  }

  closeClientForm(event: boolean): void {
    this.showClientForm = false;

  }
}
