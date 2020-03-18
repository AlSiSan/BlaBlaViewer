import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-data-options',
  templateUrl: './data-options.component.html',
  styleUrls: ['./data-options.component.css']
})
export class DataOptionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  applyFilters(filters: NgForm) {
    console.log(filters.control.value);
  }

}
