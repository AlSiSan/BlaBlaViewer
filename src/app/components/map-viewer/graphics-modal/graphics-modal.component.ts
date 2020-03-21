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

  constructor( private comm: CommunicationService ) { }

  ngOnInit() {
    this.loadingGraphics = true;
    new Promise(r => setTimeout(r, 300)).then(() => {
      this.loadingGraphics = false;
      this.journeysPerDay();
    });
  }

  isLoadingGraphics() {
    return this.loadingGraphics;
  }

  journeysPerDay() {
    let journeysPerDayDf = this.comm.journeysDf.groupBy('DIA')
          .aggregate(group => group.count()).rename('aggregation', 'groupCount');

    let serie = [];
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


}
