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

  // Alerts other components to update
  applyFilters() {
    this.filtersUpdated.emit();
  }

  // Gets the list of provinces
  getProvsOrigin() {
    return this.comm.filterProvincesOrigin;
  }

  // Gets the list of provinces
  getProvsDestination() {
    return this.comm.filterProvincesDestination;
  }

  // When changed, the graphics modal has to render again
  // The component has to be destroyed, so when it is rendered,
  // The graphics render with the size of the modal
  restoreGraphicsModal() {
    this.comm.setGraphicsShown(false);
  }

}
