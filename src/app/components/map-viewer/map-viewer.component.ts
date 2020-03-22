import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MapServiceService } from 'src/app/services/map-service.service';
import { transform } from 'ol/proj';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css']
})
export class MapViewerComponent implements OnInit, OnDestroy {

  viewerBottom: string;

  constructor( private router: Router, private mapService: MapServiceService, private comm: CommunicationService) {
    this.viewerBottom = '200px';
    // this.comm.getJourneysData();
   }

  ngOnInit() {
    this.mapService.generateMap().setTarget('viewerBlablaviewer');
  }

  graphicsShown() {
    return this.comm.graphicsShown;
  }

  ngOnDestroy(): void {
    this.mapService.restoreInitialView();
  }

  getMapLegend() {
    return this.mapService.getMap().getLegend();
  }

  reloadMap() {
    const center = transform(this.mapService.getMap().getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
    const zoom = this.mapService.getMap().getView().getZoom();
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.mapService.setInitialView(center, zoom);
      this.router.navigate(['viewer']);
    });
  }

}
