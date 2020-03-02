import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.changeTooglerNavbar();
    }
  }

  constructor( private eRef: ElementRef, public status: StatusService ) {
  }

  ngOnInit() {
  }

  changeTooglerNavbar() {
    if (document.getElementById('navbarSupportedContent').className.includes('show')) {
      document.getElementById('navbar-toogler').click();
    }
  }

}
