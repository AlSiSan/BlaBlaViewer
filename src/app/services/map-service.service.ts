import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenMap } from '../models/gen-map';
import { globalConfig } from '../modules/globalconfig/globalconfig.module';
import { transform } from 'ol/proj';
import { View } from 'ol';
import { Subject, Observable } from 'rxjs';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  private map: GenMap;
  private opt = {};

  public selectionData = new Subject<any>();

  constructor( private http: HttpClient, private comm: CommunicationService ) { }

  // Generates the map according to the defined model
  generateMap() {
    if (this.opt['view'] === undefined) {
      this.restoreInitialView();
    }
    this.map = new GenMap( this.comm, this.opt );

    return this.map;
  }

  getMap() {
    return this.map;
  }

  // set the initial view given a configuration
  setInitialView(lonLat, zoomLevel) {
    this.opt['view'] = new View({
      center: transform(lonLat, 'EPSG:4326', 'EPSG:3857'),
      zoom: zoomLevel,
      maxZoom: 20
    });
  }

  // initial view
  restoreInitialView() {
    this.opt['view'] = new View({
      center: transform([-0.92, 39], 'EPSG:4326', 'EPSG:3857'),
      zoom: 6,
      maxZoom: 20
    });
  }

  // set the layers manager
  setLayerSwitcher( ) {
    this.getMap().setLayerSwitcher();
  }

  // geocode a given location and set the view on it
  geocodeLocation( criteria ) {
    this.http.get('https://open.mapquestapi.com/nominatim/v1/search.php', {
      params: {
        key: globalConfig.mapquestApiKey,
        format: 'json',
        q: criteria
      }
    })
      .subscribe((data) => {
        const place = data[0];
        const mapSize = this.map.getSize();
        const locationCoords = transform([place.lon, place.lat], 'EPSG:4326', 'EPSG:3857');
        this.map.getView().centerOn(locationCoords, this.map.getSize(), [mapSize[0] / 2, mapSize[1] / 2]);
        this.map.getView().setZoom(12);
      });
  }

}
