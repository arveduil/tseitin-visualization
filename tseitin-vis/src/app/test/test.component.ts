import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Network, DataSet } from 'vis';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  @ViewChild('network') el: ElementRef;
  private networkInstance: any;

  ngOnInit() {

    const response = {
      clauses: 13,
      dimacs: '1 2 -3 0 -1 3 0 -2 3 0 -3 -4 5 0 3 -5 0 4 -5 0 -6 -7 -8 0 6 8 0 7 8 0 5 8 -9 0 -5 9 0 -8 9 0 9 0',
      terms: 9
    };

    const nodes = new DataSet([
      {id: 1, label: 'Node 1', group: '0'},
      {id: 2, label: 'Node 2', group: '1' },
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'},
    ]);

// create an array with edges
    const edges = new DataSet([
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5},
      {from: 3, to: 3},
    ]);

// create a network
    const container = document.getElementById('mynetwork');
    const data = {
      nodes,
      edges,
    };
    const options ={
      nodes: {
        shape: "dot",
        size: 30,
        font: {
          size: 32,
          color: "#ffffff",
        },
        borderWidth: 2,
      },
      edges: {
        width: 2,
      },
    };
    const network = new Network(container, data, options);
  }
}
