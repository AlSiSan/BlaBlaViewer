import { Injectable } from '@angular/core';
import { GenMap } from '../models/gen-map';
import { globalConfig } from '../modules/globalconfig/globalconfig.module';
import { transform } from 'ol/proj';
import { click, pointerMove, altKeyOnly } from 'ol/events/condition';
import { View } from 'ol';
import { Subject, Observable } from 'rxjs';
import { GenSelect } from '../models/customLayers/gen-layers';

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

  constructor( ) { }
  

  generateMap() {
    if (this.opt['view'] === undefined) {
      this.restoreInitialView();
    }
    this.map = new GenMap( this.opt );

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

}
