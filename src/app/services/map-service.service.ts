import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenMap } from '../models/gen-map';
import { globalConfig } from '../modules/globalconfig/globalconfig.module';
import { transform } from 'ol/proj';
import { click, pointerMove, altKeyOnly } from 'ol/events/condition';
import { View } from 'ol';
import { Subject, Observable } from 'rxjs';
import { GenSelect } from '../models/customLayers/gen-layers';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  // @Output() toolChanged: EventEmitter<any> = new EventEmitter();

  private map: GenMap;
  private opt = {};

  private hoverSelect = null;
  private hoverLayer = undefined;

  public selectionData = new Subject<any>();

  constructor( private http: HttpClient, private comm: CommunicationService ) { }


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

  setInitialView(lonLat, zoomLevel) {
    this.opt['view'] = new View({
      center: transform(lonLat, 'EPSG:4326', 'EPSG:3857'),
      zoom: zoomLevel,
      maxZoom: 20
    });
  }

  restoreInitialView() {
    this.opt['view'] = new View({
      center: transform([-0.92, 39.96], 'EPSG:4326', 'EPSG:3857'),
      zoom: 6,
      maxZoom: 20
    });
  }

  setLayerSwitcher( ) {
    this.getMap().setLayerSwitcher();
  }

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
