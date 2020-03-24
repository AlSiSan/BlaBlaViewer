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

    // It commands to gather the data
    this.comm.getJourneysData()
      .subscribe((res) => {
        // console.log(res);
      });
   }

  // Generates the map
  ngOnInit() {
    this.mapService.generateMap().setTarget('viewerBlablaviewer');
  }

  // Checks if the graphics are being shown, if the modal has been opened
  graphicsShown() {
    return this.comm.graphicsShown;
  }

  // When you change of view to another component of the app, the view is restored
  ngOnDestroy(): void {
    this.mapService.restoreInitialView();
  }

  // not using it at the moment, it is for getting the legend of the population layer
  getMapLegend() {
    return this.mapService.getMap().getLegend();
  }

  // For refreshing the map without losing the view
  reloadMap() {
    const center = transform(this.mapService.getMap().getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
    const zoom = this.mapService.getMap().getView().getZoom();
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.mapService.setInitialView(center, zoom);
      this.router.navigate(['viewer']);
    });
  }

}
