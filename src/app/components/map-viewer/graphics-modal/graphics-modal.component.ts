import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import * as Chartist from 'chartist';
import 'chartist-plugin-tooltips';
import 'chartist-plugin-axistitle';


@Component({
  selector: 'app-graphics-modal',
  templateUrl: './graphics-modal.component.html',
  styleUrls: ['./graphics-modal.component.css']
})
export class GraphicsModalComponent implements OnInit {

  loadingGraphics: boolean;
  journeysPerDayChart: any;
  journeysPerOriginChart: any;

  constructor( private comm: CommunicationService ) { }

  ngOnInit() {
    this.loadingGraphics = true;
    new Promise(r => setTimeout(r, 300)).then(() => {
      this.loadingGraphics = false;

      // Graphics generation with concurrency
      new Promise(r => setTimeout(r, 1)).then(() => {
        this.journeysPerDay();
        this.pricePerKmPerDay();
        this.newOffersPerDay();
        this.newOffersPerProvince();
      });
      this.journeysPerOrigin();
      this.journeysPerDestination();
      this.pricePerOrigin();
      this.pricePerDestination();
    });
  }

  // Checks if it is loading graphics for showing a message
  isLoadingGraphics() {
    return this.loadingGraphics;
  }

  // Graphics code, the name itself identifies the graphics
  // If reverse in the name, the graphic is descendant
  journeysPerDay() {
    const journeysPerDayDf = this.comm.dataPerDayDf;

    const serie = [];
    const daysLabels = journeysPerDayDf.toArray('DIA');

    journeysPerDayDf.toArray('VIAJES_CONFIRMADOS').forEach((journeysOneDay, index) => {
      const date = new Date(daysLabels[index].substring(0, 10));
      serie.push({
        meta: date.toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'}),
        value: journeysOneDay
      });
    });

    this.journeysPerDayChart = new Chartist.Line('#journeysPerDayChart', {
      labels: daysLabels,
      series: [
        serie
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 20,
      },
      axisX: {
        labelInterpolationFnc: function skipLabels(value, index) {
          return index % (5 * Math.ceil((journeysPerDayDf.count() / 30))) === 0 ?
                  `${value.substring(8, 10)}/${value.substring(5, 7)}/${value.substring(2, 4)}` : null;
        }
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Días',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Viajes',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });
  }

  newOffersPerDay() {
    const journeysPerDayDf = this.comm.dataPerDayDf;

    const serie = [];
    const daysLabels = journeysPerDayDf.toArray('DIA');

    journeysPerDayDf.toArray('OFERTANTES_NUEVOS').forEach((journeysOneDay, index) => {
      const date = new Date(daysLabels[index].substring(0, 10));
      serie.push({
        meta: date.toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'}),
        value: journeysOneDay
      });
    });

    this.journeysPerDayChart = new Chartist.Line('#newOffersPerDayChart', {
      labels: daysLabels,
      series: [
        serie
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 20,
      },
      axisX: {
        labelInterpolationFnc: function skipLabels(value, index) {
          return index % (5 * Math.ceil((journeysPerDayDf.count() / 30))) === 0 ?
                  `${value.substring(8, 10)}/${value.substring(5, 7)}/${value.substring(2, 4)}` : null;
        }
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Días',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Nuevos ofertantes',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });
  }

  newOffersPerProvince() {
    let journeysPerDayDf = this.comm.dataPerTrackDf
          .filter(row => row.get('ORIGEN_P') !== 'Otros')
          .groupBy('ORIGEN_P')
          .aggregate(group => group.stat.sum('OFERTANTES_NUEVOS'))
          .rename('aggregation', 'OFERTANTES_NUEVOS')
          .sortBy('OFERTANTES_NUEVOS', true);

    this.journeysPerOriginChart = new Chartist.Bar('#newOffersPerProvinceChart', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('OFERTANTES_NUEVOS')
      ]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Nuevos ofertantes',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });
  }

  pricePerKmPerDay() {
    const pricesPerDayDf = this.comm.dataPerDayDf;

    const serie = [];
    const daysLabels = pricesPerDayDf.toArray('DIA');

    pricesPerDayDf.toArray('IMP_KM').forEach((priceOneDay, index) => {
      const date = new Date(daysLabels[index].substring(0, 10));
      serie.push({
        meta: date.toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'}),
        value: priceOneDay * 100
      });
    });

    this.journeysPerDayChart = new Chartist.Line('#pricePerKmPerDayChart', {
      labels: daysLabels,
      series: [
        serie
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 20,
      },
      axisX: {
        labelInterpolationFnc: function skipLabels(value, index) {
          return index % (5 * Math.ceil((pricesPerDayDf.count() / 30))) === 0 ?
                  `${value.substring(8, 10)}/${value.substring(5, 7)}/${value.substring(2, 4)}` : null;
        }
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Días',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'cents. de € / km',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });
  }

  journeysPerOrigin() {
    let journeysPerDayDf = this.comm.dataPerOriginDf
          .filter(row => row.get('ORIGEN_P') !== 'Otros')
          .sortBy('VIAJES_CONFIRMADOS', true);

    this.journeysPerOriginChart = new Chartist.Bar('#journeysPerOriginChart', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('VIAJES_CONFIRMADOS')
      ]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Viajes',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });

    journeysPerDayDf = journeysPerDayDf.sortBy('VIAJES_CONFIRMADOS');
    this.journeysPerOriginChart = new Chartist.Bar('#journeysPerOriginChartRev', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('VIAJES_CONFIRMADOS')
      ]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Viajes',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });
  }

  journeysPerDestination() {
    let journeysPerDayDf = this.comm.dataPerDestinationDf
          .filter(row => row.get('DESTINO_P') !== 'Otros')
          .sortBy('VIAJES_CONFIRMADOS', true);

    this.journeysPerOriginChart = new Chartist.Bar('#journeysPerDestinationChart', {
      labels: journeysPerDayDf.head(10).toArray('DESTINO_P'),
      series: [journeysPerDayDf.head(10).toArray('VIAJES_CONFIRMADOS')
      ]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Viajes',
            axisClass: 'ct-axis-title',
            offset: {
              x: -10,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });

    journeysPerDayDf = journeysPerDayDf.sortBy('VIAJES_CONFIRMADOS');

    this.journeysPerOriginChart = new Chartist.Bar('#journeysPerDestinationChartRev', {
      labels: journeysPerDayDf.head(10).toArray('DESTINO_P'),
      series: [journeysPerDayDf.head(10).toArray('VIAJES_CONFIRMADOS')
      ]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Viajes',
            axisClass: 'ct-axis-title',
            offset: {
              x: -10,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });
  }

  pricePerOrigin() {
    let journeysPerDayDf = this.comm.dataPerOriginDf
          .filter(row => row.get('ORIGEN_P') !== 'Otros')
          .sortBy('IMP_KM', true);

    let lowValue = journeysPerDayDf.head(10).stat.min('IMP_KM') * 100;
    let highValue = journeysPerDayDf.head(10).stat.max('IMP_KM') * 100;

    this.journeysPerOriginChart = new Chartist.Bar('#pricePerOriginChart', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('IMP_KM').map((price) => price * 100)]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      low: (lowValue - 0.5 > 0) ? (lowValue - 0.5) : 0,
      high: highValue + 0.5,
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'cents. de € / km',
            axisClass: 'ct-axis-title',
            offset: {
              x: -10,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });

    journeysPerDayDf = journeysPerDayDf.sortBy('IMP_KM');

    lowValue = journeysPerDayDf.head(10).stat.min('IMP_KM') * 100;
    highValue = journeysPerDayDf.head(10).stat.max('IMP_KM') * 100;

    this.journeysPerOriginChart = new Chartist.Bar('#pricePerOriginChartRev', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('IMP_KM').map((price) => price * 100)]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      low: (lowValue - 0.5 > 0) ? (lowValue - 0.5) : 0,
      high: highValue + 0.5,
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'cents. de € / km',
            axisClass: 'ct-axis-title',
            offset: {
              x: -10,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });
  }

  pricePerDestination() {
    let journeysPerDayDf = this.comm.dataPerDestinationDf
          .filter(row => row.get('DESTINO_P') !== 'Otros')
          .sortBy('IMP_KM', true);

    let lowValue = journeysPerDayDf.head(10).stat.min('IMP_KM') * 100;
    let highValue = journeysPerDayDf.head(10).stat.max('IMP_KM') * 100;

    this.journeysPerOriginChart = new Chartist.Bar('#pricePerDestinationChart', {
      labels: journeysPerDayDf.head(10).toArray('DESTINO_P'),
      series: [journeysPerDayDf.head(10).toArray('IMP_KM').map((price) => price * 100)]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      low: (lowValue - 0.5 > 0) ? (lowValue - 0.5) : 0,
      high: highValue + 0.5,
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'cents. de € / km',
            axisClass: 'ct-axis-title',
            offset: {
              x: -10,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });

    journeysPerDayDf = journeysPerDayDf.sortBy('IMP_KM');

    lowValue = journeysPerDayDf.head(10).stat.min('IMP_KM') * 100;
    highValue = journeysPerDayDf.head(10).stat.max('IMP_KM') * 100;

    this.journeysPerOriginChart = new Chartist.Bar('#pricePerDestinationChartRev', {
      labels: journeysPerDayDf.head(10).toArray('DESTINO_P'),
      series: [journeysPerDayDf.head(10).toArray('IMP_KM').map((price) => price * 100)]
    }, {
      chartPadding: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 30,
      },
      low: (lowValue - 0.5 > 0) ? (lowValue - 0.5) : 0,
      high: highValue + 0.5,
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 70,
        labelInterpolationFnc: (value) => value.split('/')[0]
      },
      plugins: [
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'cents. de € / km',
            axisClass: 'ct-axis-title',
            offset: {
              x: -10,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Provincias',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        }),
          Chartist.plugins.tooltip()
      ]
    });
  }


}
