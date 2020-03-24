import { Component, OnInit } from '@angular/core';
import { MapServiceService } from 'src/app/services/map-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor( private mapService: MapServiceService ) { }

  ngOnInit() {
  }

  // Geocode a place name
  search() {
    let value = (<HTMLInputElement>document.getElementById('textSearch')).value;
    this.mapService.geocodeLocation(value);
  }

}
