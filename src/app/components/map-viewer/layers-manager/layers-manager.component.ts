import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapServiceService } from 'src/app/services/map-service.service';

@Component({
  selector: 'app-layers-manager',
  templateUrl: './layers-manager.component.html',
  styleUrls: ['./layers-manager.component.css']
})
export class LayersManagerComponent implements OnInit, OnDestroy {

  constructor(private mapService: MapServiceService ) { }

  ngOnInit() {

    this.mapService.setLayerSwitcher();

    let elementLS = document.getElementsByClassName('layer-switcher')[0];
    document.getElementById('layersListManager').appendChild(elementLS);
  }

  ngOnDestroy(): void {
    this.mapService.getMap().getControls().forEach((control) => {
      if (control.constructor.name === 'LayerSwitcher') {
        this.mapService.getMap().getControls().remove(control);
      }
    });
  }

}
