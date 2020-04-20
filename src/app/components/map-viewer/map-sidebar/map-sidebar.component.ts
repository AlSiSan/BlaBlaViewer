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

  // closes the sidebar when the user clicks outside
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (!document.getElementById('sidebarData').className.includes('active')) {
        this.changeTooglerSidebar();
      }
    }
  }

  // manages the view in the sidebar
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

  // alerts other components when the filters are updated
  onFiltersUpdated() {
    this.filtersUpdated.emit();
  }

  // check if there is communication for showing the graphics or not
  isLoaded() {
    return this.comm.loadFinished();
  }

  // shows the graphics
  showGraphics() {
    this.comm.graphicsShown = true;
  }

}
