import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globalConfig } from '../modules/globalconfig/globalconfig.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  filterOptions = {
    dateFrom: '2017-11-11',
    monthsNum: '2',
    countryFrom: '',
    countryTo: '',
    provinceFrom: '',
    provinceTo: ''
  };

  filterProvincesOrigin = [];
  filterProvincesDestination = [];
  journeys = [];

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

  getJourneysData() {
    return this.http.get(`${globalConfig.serverUrl}/getJourneys`, { params: this.filterOptions })
      .pipe(map((journeys: []) => {
        this.journeys = journeys;
        return journeys;
      }));
  }

}
