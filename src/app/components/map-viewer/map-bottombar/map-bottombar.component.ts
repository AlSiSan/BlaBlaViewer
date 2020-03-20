import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-map-bottombar',
  templateUrl: './map-bottombar.component.html',
  styleUrls: ['./map-bottombar.component.css']
})
export class MapBottombarComponent implements OnInit {

  constructor( public comm: CommunicationService ) { }

  ngOnInit() {

  }

}
