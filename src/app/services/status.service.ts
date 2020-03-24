import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  isMap = false;

  constructor( private router: Router) {
    // Checks if the map is being shown
    router.events.subscribe(() => this.checkUrlMap(this.router.url));
  }

  // Checks if the map is being shown
  checkUrlMap(value) {
    this.isMap = value.includes('/viewer');
  }

}
