import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { globalConfig } from '../modules/globalconfig/globalconfig.module';
import { map } from 'rxjs/operators';
import { DataFrame } from 'dataframe-js/';
import { Subject } from 'rxjs';

export class UtilsService {
  static buildQueryParams(source: Object): HttpParams {
      let target: HttpParams = new HttpParams();
      Object.keys(source).forEach((key: string) => {
          const value: string | number | boolean | Date = source[key];
          if ((typeof value !== 'undefined') && (value !== null)) {
              target = target.append(key, value.toString());
          }
      });
      return target;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  loading = true;
  graphicsShown = false;

  filterOptions = {
    dateFrom: '2017-11-01',
    monthsNum: 1,
    countryFrom: '',
    countryTo: '',
    provinceFrom: '',
    provinceTo: '',
    minOccR: 0,
    maxOccR: 1
  };

  filterProvincesOrigin = [];
  filterProvincesDestination = [];

  dataPerDayDf: DataFrame;
  dataPerOriginDf: DataFrame;
  dataPerDestinationDf: DataFrame;
  dataPerTrackDf: DataFrame;

  dataPerDaySubject = new Subject<any>();
  dataPerOriginSubject = new Subject<any>();
  dataPerDestinationSubject = new Subject<any>();
  dataPerTrackSubject = new Subject<any>();

  totalJourneys = 0;
  totalDays = 0;
  totalJourneysPerDay = 0;

  // Gets the provinces from the database when starting the service
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

  getInfoPerDay() {
    this.loading = true;
    return this.http.get(`${globalConfig.serverUrl}/getInfoPerDay`, { params: UtilsService.buildQueryParams(this.filterOptions) })
      .pipe(map((res: Array<any>) => {
        let info = res.map((elem) => {
          return {
            DIA: elem._id,
            IMP_KM: elem.IMP_KM,
            VIAJES_CONFIRMADOS: elem.VIAJES_CONFIRMADOS
          };
        });

        this.dataPerDayDf = new DataFrame(info);
        this.dataPerDaySubject.next(Date.now());

        this.totalJourneys = this.dataPerDayDf.stat.sum('VIAJES_CONFIRMADOS');
        this.totalJourneysPerDay = this.dataPerDayDf.stat.mean('VIAJES_CONFIRMADOS').toFixed(2);
        this.totalDays = this.dataPerDayDf.count();

        this.loading = false;
      }));
  }

  getInfoPerTrack() {
    return this.http.get(`${globalConfig.serverUrl}/getInfoPerTrack`, { params: UtilsService.buildQueryParams(this.filterOptions) })
    .pipe(map((res: Array<any>) => {
      let info = res.map((elem) => {
        return {
          ORIGEN_C: elem._id.ori,
          DESTINO_C: elem._id.dest,
          ORIGEN_P: elem.ORIGEN_P[0],
          DESTINO_P: elem.DESTINO_P[0],
          IMP_KM: elem.IMP_KM,
          VIAJES_CONFIRMADOS: elem.VIAJES_CONFIRMADOS
        };
      });

      this.dataPerTrackDf = new DataFrame(info);
      this.dataPerTrackSubject.next(Date.now());

      }));
  }
  getInfoPerOrigin() {
    return this.http.get(`${globalConfig.serverUrl}/getInfoPerOrigin`, { params: UtilsService.buildQueryParams(this.filterOptions) })
    .pipe(map((res: Array<any>) => {
      let info = res.map((elem) => {
        return {
          ORIGEN_P: elem._id.ori,
          IMP_KM: elem.IMP_KM,
          VIAJES_CONFIRMADOS: elem.VIAJES_CONFIRMADOS
        };
      });

      this.dataPerOriginDf = new DataFrame(info);
      this.dataPerOriginSubject.next(Date.now());

      }));
  }
  getInfoPerDestination() {
    return this.http.get(`${globalConfig.serverUrl}/getInfoPerDestination`, { params: UtilsService.buildQueryParams(this.filterOptions) })
    .pipe(map((res: Array<any>) => {
      let info = res.map((elem) => {
        return {
          DESTINO_P: elem._id.dest,
          IMP_KM: elem.IMP_KM,
          VIAJES_CONFIRMADOS: elem.VIAJES_CONFIRMADOS
        };
      });

      this.dataPerDestinationDf = new DataFrame(info);
      this.dataPerDestinationSubject.next(Date.now());

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
