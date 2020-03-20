import { Component, OnInit, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.css']
})
export class MapSidebarComponent implements OnInit {

  currentType = '';
  defaultClass: string;

  @Output() filtersUpdated = new EventEmitter();

  constructor( private eRef: ElementRef, private comm: CommunicationService ) { }

  ngOnInit() {
    this.defaultClass = document.getElementById('sidebarData').className;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (!document.getElementById('sidebarData').className.includes('active')) {
        this.changeTooglerSidebar();
      }
    }
  }

  changeTooglerSidebar( type = '' ) {
    if (document.getElementById('sidebarData').className.includes('active') && type !== '') {
      let elementClassName = this.defaultClass.split('active');
      document.getElementById('sidebarData').className = elementClassName[0] + elementClassName[1];
      this.currentType = type;
    } else if (type === this.currentType || type === '') {
      document.getElementById('sidebarData').className = this.defaultClass;
      this.currentType = '';
    } else {
      this.currentType = type;
    }
  }

  onFiltersUpdated() {
    this.filtersUpdated.emit();
  }

  isLoaded() {
    return !this.comm.loading;
  }

  showGraphics() {
    this.comm.graphicsShown = true;
  }

}
