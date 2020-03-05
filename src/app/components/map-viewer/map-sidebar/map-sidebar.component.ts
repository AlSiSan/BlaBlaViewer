import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.css']
})
export class MapSidebarComponent implements OnInit {

  currentType = '';
  defaultClass: string;
  constructor( private eRef: ElementRef ) { }

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
    if (document.getElementById('sidebarData').className.includes('active')) {
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

}
