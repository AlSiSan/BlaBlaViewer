import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapServiceService } from 'src/app/services/map-service.service';

@Component({
  selector: 'app-layers-manager',
  templateUrl: './layers-manager.component.html',
  styleUrls: ['./layers-manager.component.css']
})
export class LayersManagerComponent implements OnInit, OnDestroy {

  constructor(private mapService: MapServiceService ) { }

  // Sets the layer switcher in the sidebar
  ngOnInit() {

    this.mapService.setLayerSwitcher();

    // let elementLS = document.getElementsByClassName('ol-layerswitcher')[0];
    let elementLS = document.getElementsByClassName('layer-switcher')[0];
    document.getElementById('layersListManager').appendChild(elementLS);

  }

  // removes the layerswitcher when destroyed
  ngOnDestroy(): void {
    this.mapService.getMap().getControls().forEach((control) => {
      if (control.constructor.name === 'LayerSwitcher') {
        this.mapService.getMap().getControls().remove(control);
      }
    });
  }

}
