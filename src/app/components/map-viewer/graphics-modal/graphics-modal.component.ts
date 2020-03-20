import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import * as Chartist from 'chartist';


@Component({
  selector: 'app-graphics-modal',
  templateUrl: './graphics-modal.component.html',
  styleUrls: ['./graphics-modal.component.css']
})
export class GraphicsModalComponent implements OnInit {

  journeysPerDayChart: any;

  constructor( private comm: CommunicationService ) { }

  async ngOnInit() {
    await new Promise(r => setTimeout(r, 300));
    this.journeysPerDay();
  }

  journeysPerDay() {
    let journeysPerDayDf = this.comm.journeysDf.groupBy('DIA')
          .aggregate(group => group.count()).rename('aggregation', 'groupCount');

    this.journeysPerDayChart = new Chartist.Line('#journeysPerDayChart', {
      labels: journeysPerDayDf.toArray('DIA'),
      series: [
        journeysPerDayDf.toArray('groupCount')
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        right: 40
      }
    });
  }


}
