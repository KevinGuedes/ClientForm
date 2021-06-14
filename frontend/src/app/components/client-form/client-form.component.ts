import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  @Output("close") closeClientForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output("add") addClientForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  closeForm(): void {
    this.closeClientForm.emit(true)
  }

  addForm(): void {
    this.addClientForm.emit()
  }

}
