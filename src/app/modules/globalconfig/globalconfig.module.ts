import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class GlobalconfigModule { }

export const globalConfig = {
  // serverUrl: '...herokuapp.com'
  serverUrl: 'http://localhost:1337'
};