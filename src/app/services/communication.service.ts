import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globalConfig } from '../modules/globalconfig/globalconfig.module';
import { map } from 'rxjs/operators';
import { DataFrame } from 'dataframe-js/';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  loading = true;
  graphicsShown = false;

  filterOptions = {
    dateFrom: '2017-11-01',
    monthsNum: '1',
    countryFrom: '',
    countryTo: '',
    provinceFrom: '',
    provinceTo: ''
  };

  filterProvincesOrigin = [];
  filterProvincesDestination = [];

  journeysDf: DataFrame;
  totalJourneys = 0;
  totalDays = 0;
  totalJourneysPerDay = 0;

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
    this.loading = true;
    return this.http.get(`${globalConfig.serverUrl}/getJourneys`, { params: this.filterOptions })
      .pipe(map((journeys) => {
        // this.journeys = journeys;
        this.journeysDf = new DataFrame(journeys);
        this.totalJourneys = this.journeysDf.count();

        // Grouping by Days
        const groupedDF = this.journeysDf.groupBy('DIA').aggregate(group => group.count()).rename('aggregation', 'groupCount');
        this.totalJourneysPerDay = groupedDF.stat.mean('groupCount').toFixed(2);
        this.totalDays = groupedDF.count();

        this.loading = false;
        return this.journeysDf;
      }));
  }

  loadFinished() {
    return !this.loading;
  }

  getTotalJourneys() {
    return this.totalJourneys;
  }

  getTotalJourneysPerDay() {
    return this.totalJourneysPerDay;
  }

  getTotalDays() {
    return this.totalDays;
  }

  setGraphicsShown(value) {
    this.graphicsShown = value;
  }

}
