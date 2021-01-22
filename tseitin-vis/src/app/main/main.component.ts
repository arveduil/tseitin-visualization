import {Component, OnInit} from '@angular/core';
import {Network, DataSet} from 'vis';
import {TransformationService} from '../transformation.service';
import {TransformationResponse} from '../model/transformation-response';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  cnf = '(a || b) && c || !(d && e)';
  response: TransformationResponse;
  tseitinFormula = '';

  constructor(public service: TransformationService) {
  }

  ngOnInit(): void {
    this.service.get().subscribe(res => {
      this.response = res;
      this.createGraph();
    });
  }

  transform() {
    this.service.post(this.cnf).subscribe(res => {
      this.response = res;
      this.createGraph();
    });
  }

  private createGraph() {
    const clauses = this.response.clauses;
    const terms = this.response.tseitinTermsCount;
    const dimacs = this.response.dimacs.split('0')

      .map(clause => clause.split(' ').filter(val => val !== '').map(str => +str))
      .filter(clauseSet => clauseSet.length > 0);

    console.log(dimacs);


    let clauseToExpress = new Map();
    let variableOccurenceEdges = [];

    for (let i = 0; i < dimacs.length; i++) {



      let clauseId = terms + i + 1;
      clauseToExpress.set(clauseId, dimacs[i]);
      dimacs[i].forEach(expr => {
        let border = 2;
        // if (Math.abs( expr) >= this.response.originalTermsCount) {
        //   border = 5;
        // }

          if (expr > 0) {
            variableOccurenceEdges.push({from: clauseId, to: expr, width: border});
          } else {
            variableOccurenceEdges.push({to: clauseId, from: -expr, width: border});
          }
        }
      );
    }


    console.log(clauseToExpress);

    let rawNodes = [];
    for (let i = 1; i <= terms; i++) {
      let shape = 'dot';
      // if (i <= this.response.originalTermsCount) {
      //   shape = 'dot';
      // } else {
      //   shape = 'hexagon';
      // }
      rawNodes.push({id: i, label: '' + i, shape: shape, y: -200, x: i * 150 + 100, color: 'blue'});
    }

    for (let i = terms + 1; i <= terms + clauses; i++) {
      let clauseLabel = clauseToExpress.get(i);
      rawNodes.push({id: i, label: clauseLabel.toString(), shape: 'square', color: 'red', y: 200, x: (i - terms) * 150});
    }

    console.log(clauses);

    this.tseitinFormula = this.response.tseitinFormula;

    const nodes = new DataSet(rawNodes);

    const edges = new DataSet(
      variableOccurenceEdges
    );

    const container = document.getElementById('mynetwork');
    const data = {
      nodes,
      edges,
    };
    const options = {
      nodes: {
        size: 30,
        font: {
          size: 32,
          color: 'black'
        },
      },
      edges: {
        width: 2
      },
      physics: {
        enabled: false,
      },
    };
    const network = new Network(container, data, options);
  }
}
