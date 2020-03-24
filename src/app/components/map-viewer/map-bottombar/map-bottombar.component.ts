import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-map-bottombar',
  templateUrl: './map-bottombar.component.html',
  styleUrls: ['./map-bottombar.component.css']
})
export class MapBottombarComponent implements OnInit {

  dateFrom: string;
  dateTo: string;
  constructor( public comm: CommunicationService ) { }

  ngOnInit() {
    this.getDates();
  }

  // Gets date in the current language
  getDates() {
    const date = new Date(this.comm.filterOptions.dateFrom);
    this.dateFrom = date.toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'});
    date.setMonth(date.getMonth() + (+this.comm.filterOptions.monthsNum));
    date.setDate(date.getDate() - 1);
    this.dateTo = date.toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'});
  }

}
