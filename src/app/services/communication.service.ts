import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globalConfig } from '../modules/globalconfig/globalconfig.module';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  filterOptions = {
    dateFrom: '2017-11-01',
    dateTo: '2018-02-28',
    countryFrom: '',
    countryTo: '',
    provinceFrom: '',
    provinceTo: ''
  };

  filterProvincesOrigin = [];
  filterProvincesDestination = [];

  constructor( private http: HttpClient ) {
    http.get(`${globalConfig.serverUrl}/getProvincesOrigin`)
      .subscribe((provs: []) => {
        this.filterProvincesOrigin = provs;
      });

    http.get(`${globalConfig.serverUrl}/getProvincesDestination`)
      .subscribe((provs: []) => {
        this.filterProvincesDestination = provs;
      });
  }
}
