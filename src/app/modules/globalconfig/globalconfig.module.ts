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
  mapquestApiKey: 'dNT9MRdmqkALT9istlck0SgAzzrsa87U',
  serverUrl: 'https://blablaviewerserver.herokuapp.com'
  //  serverUrl: 'http://localhost:1337'
};