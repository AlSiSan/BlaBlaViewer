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
      });
      new Promise(r => setTimeout(r, 1)).then(() => {
        this.journeysPerOrigin();
        this.journeysPerDestination();
        this.pricePerOrigin();
        this.pricePerDestination();
      });
      new Promise(r => setTimeout(r, 1)).then(() => {
        this.journeysPerOriginRev();
        this.journeysPerDestinationRev();
        this.pricePerOriginRev();
        this.pricePerDestinationRev();
      });
    });
  }

  // Checks if it is loading graphics for showing a message
  isLoadingGraphics() {
    return this.loadingGraphics;
  }

  // Graphics code, the name itself identifies the graphics
  // If reverse in the name, the graphic is descendant
  journeysPerDay() {
    const journeysPerDayDf = this.comm.journeysDf.groupBy('DIA')
          .aggregate(group => group.stat.sum('VIAJES_CONFIRMADOS')).rename('aggregation', 'groupCount');

    const serie = [];
    const daysLabels = journeysPerDayDf.toArray('DIA');

    journeysPerDayDf.toArray('groupCount').forEach((journeysOneDay, index) => {
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

  pricePerKmPerDay() {
    const pricesPerDayDf = this.comm.journeysDf.groupBy('DIA')
                          .aggregate(group => (group.stat.mean('IMP_KM') * 100)).rename('aggregation', 'IMP_KM');

    const serie = [];
    const daysLabels = pricesPerDayDf.toArray('DIA');

    pricesPerDayDf.toArray('IMP_KM').forEach((priceOneDay, index) => {
      const date = new Date(daysLabels[index].substring(0, 10));
      serie.push({
        meta: date.toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'}),
        value: priceOneDay
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
    const journeysPerDayDf = this.comm.journeysDf.groupBy('ORIGEN_P')
          .aggregate(group => group.stat.sum('VIAJES_CONFIRMADOS')).rename('aggregation', 'groupCount')
          .filter(row => row.get('ORIGEN_P') !== 'Otros')
          .sortBy('groupCount', true);

    this.journeysPerOriginChart = new Chartist.Bar('#journeysPerOriginChart', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('groupCount')
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
    const journeysPerDayDf = this.comm.journeysDf.groupBy('DESTINO_P')
          .aggregate(group => group.stat.sum('VIAJES_CONFIRMADOS')).rename('aggregation', 'groupCount')
          .filter(row => row.get('DESTINO_P') !== 'Otros')
          .sortBy('groupCount', true);

    this.journeysPerOriginChart = new Chartist.Bar('#journeysPerDestinationChart', {
      labels: journeysPerDayDf.head(10).toArray('DESTINO_P'),
      series: [journeysPerDayDf.head(10).toArray('groupCount')
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
    const journeysPerDayDf = this.comm.journeysDf.groupBy('ORIGEN_P')
          .aggregate(group => (group.stat.mean('IMP_KM') * 100)).rename('aggregation', 'IMP_KM')
          .filter(row => row.get('ORIGEN_P') !== 'Otros')
          .sortBy('IMP_KM', true);

    const lowValue = journeysPerDayDf.head(10).stat.min('IMP_KM');
    const highValue = journeysPerDayDf.head(10).stat.max('IMP_KM');

    this.journeysPerOriginChart = new Chartist.Bar('#pricePerOriginChart', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('IMP_KM')
      ]
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
    const journeysPerDayDf = this.comm.journeysDf.groupBy('DESTINO_P')
          .aggregate(group => (group.stat.mean('IMP_KM') * 100)).rename('aggregation', 'IMP_KM')
          .filter(row => row.get('DESTINO_P') !== 'Otros')
          .sortBy('IMP_KM', true);

    const lowValue = journeysPerDayDf.head(10).stat.min('IMP_KM');
    const highValue = journeysPerDayDf.head(10).stat.max('IMP_KM');

    this.journeysPerOriginChart = new Chartist.Bar('#pricePerDestinationChart', {
      labels: journeysPerDayDf.head(10).toArray('DESTINO_P'),
      series: [journeysPerDayDf.head(10).toArray('IMP_KM')
      ]
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
  journeysPerOriginRev() {
    const journeysPerDayDf = this.comm.journeysDf.groupBy('ORIGEN_P')
          .aggregate(group => group.stat.sum('VIAJES_CONFIRMADOS')).rename('aggregation', 'groupCount')
          .filter(row => row.get('ORIGEN_P') !== 'Otros')
          .sortBy('groupCount');

    this.journeysPerOriginChart = new Chartist.Bar('#journeysPerOriginChartRev', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('groupCount')
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

  journeysPerDestinationRev() {
    const journeysPerDayDf = this.comm.journeysDf.groupBy('DESTINO_P')
          .aggregate(group => group.stat.sum('VIAJES_CONFIRMADOS')).rename('aggregation', 'groupCount')
          .filter(row => row.get('DESTINO_P') !== 'Otros')
          .sortBy('groupCount');

    this.journeysPerOriginChart = new Chartist.Bar('#journeysPerDestinationChartRev', {
      labels: journeysPerDayDf.head(10).toArray('DESTINO_P'),
      series: [journeysPerDayDf.head(10).toArray('groupCount')
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

  pricePerOriginRev() {
    const journeysPerDayDf = this.comm.journeysDf.groupBy('ORIGEN_P')
          .aggregate(group => (group.stat.mean('IMP_KM') * 100)).rename('aggregation', 'IMP_KM')
          .filter(row => row.get('ORIGEN_P') !== 'Otros')
          .sortBy('IMP_KM');

    const lowValue = journeysPerDayDf.head(10).stat.min('IMP_KM');
    const highValue = journeysPerDayDf.head(10).stat.max('IMP_KM');

    this.journeysPerOriginChart = new Chartist.Bar('#pricePerOriginChartRev', {
      labels: journeysPerDayDf.head(10).toArray('ORIGEN_P'),
      series: [journeysPerDayDf.head(10).toArray('IMP_KM')
      ]
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

  pricePerDestinationRev() {
    const journeysPerDayDf = this.comm.journeysDf.groupBy('DESTINO_P')
          .aggregate(group => (group.stat.mean('IMP_KM') * 100)).rename('aggregation', 'IMP_KM')
          .filter(row => row.get('DESTINO_P') !== 'Otros')
          .sortBy('IMP_KM');

    const lowValue = journeysPerDayDf.head(10).stat.min('IMP_KM');
    const highValue = journeysPerDayDf.head(10).stat.max('IMP_KM');

    this.journeysPerOriginChart = new Chartist.Bar('#pricePerDestinationChartRev', {
      labels: journeysPerDayDf.head(10).toArray('DESTINO_P'),
      series: [journeysPerDayDf.head(10).toArray('IMP_KM')
      ]
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
