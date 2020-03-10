import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MapServiceService } from 'src/app/services/map-service.service';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css']
})
export class MapViewerComponent implements OnInit, OnDestroy {

  viewerBottom: string;

  constructor( private router: Router, private mapService: MapServiceService) {
    this.viewerBottom = '200px';
   }

  ngOnInit() {
    this.mapService.generateMap().setTarget('viewerBlablaviewer');
  }

  ngOnDestroy(): void {
    this.mapService.restoreInitialView();
  }

  getMapLegend() {
    return this.mapService.getMap().getLegend();
  }

}
