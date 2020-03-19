import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-data-options',
  templateUrl: './data-options.component.html',
  styleUrls: ['./data-options.component.css']
})
export class DataOptionsComponent implements OnInit {

  @Output() filtersUpdated = new EventEmitter();

  constructor( public comm: CommunicationService ) { }

  ngOnInit() {
  }

  applyFilters() {
    this.filtersUpdated.emit();
  }

  getProvsOrigin() {
    return this.comm.filterProvincesOrigin;
  }

  getProvsDestination() {
    return this.comm.filterProvincesDestination;
  }

}
