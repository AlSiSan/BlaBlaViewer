import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  isMap = false;

  constructor( private router: Router) {
    router.events.subscribe(() => this.checkUrlMap(this.router.url));
  }

  checkUrlMap(value) {
    this.isMap = value.includes('/viewer');
  }

}
