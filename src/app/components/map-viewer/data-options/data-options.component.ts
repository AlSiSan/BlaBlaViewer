import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-data-options',
  templateUrl: './data-options.component.html',
  styleUrls: ['./data-options.component.css']
})
export class DataOptionsComponent implements OnInit {

  constructor( public comm: CommunicationService ) { }

  ngOnInit() {
  }

  applyFilters() {
    console.log('reload data');
  }

  getProvsOrigin() {
    return this.comm.filterProvincesOrigin;
  }

  getProvsDestination() {
    return this.comm.filterProvincesDestination;
  }

}
