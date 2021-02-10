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
    this.transform();
  }

  transform() {
    this.service.post(this.cnf).subscribe(res => {
      this.response = res;
      this.createGraph();
    });
  }

  private getTseitinVariables(formula: string, clauses: Map<number, Array<number>>, terms: number): [Set<number>, Map<number, string>]  {
    const formulaWithoutAnd = formula
      .replace(/ and /g, '');

    let res = formulaWithoutAnd
        .split(')')
        .map(alternative => alternative
          .split(' ')
          .filter(variable => variable !== 'or')
          .map(variable => variable
            .replace('(', '')
            .replace('!', ''))
        )
      //  .splice(-1, 1)
    ;

    res.splice(-1, 1);

    let output = new Set<number>();
    let primaryVariables = new Map<number,string>();

    console.log(res);
    console.log(clauses);
    if (res.length !== clauses.size) {
      console.log('WRONG AMOUNT OF CLAUSES ' + res.length + ' ' + clauses.size);
    }
    for (let i = terms + 1; i <= res.length + terms; i++) {
      const alternativesFromFormula = res[i - terms - 1];
      const clause = clauses.get(i);

      if (alternativesFromFormula.length !== clause.length) {
        console.log('alternativesFromFormula: ' + alternativesFromFormula);
        console.log('clause: ' + clause);
      }

      for (let j = 0; j < clause.length; j++) {
        console.log(alternativesFromFormula[j]);
        if (alternativesFromFormula[j].includes('phi')) {
          output.add(Math.abs(clause[j]));
          //console.log(clause[j]);
        }else{
          primaryVariables.set(Math.abs(clause[j]) , alternativesFromFormula[j]);
        }
      }
    }
    console.log(output);
    return [output, primaryVariables];
  }

  private createGraph() {
    const clauses = this.response.clauses;
    const terms = this.response.tseitinTermsCount;
    const dimacs = this.response.dimacs.split('0')

      .map(clause => clause.split(' ').filter(val => val !== '').map(str => +str))
      .filter(clauseSet => clauseSet.length > 0);

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

    console.log('clause to express');
    console.log(clauseToExpress);
    const [tseitinNodesIds, primaryVariables] = this.getTseitinVariables(this.response.tseitinFormula, clauseToExpress, terms);
    console.log("prim")
    console.log(primaryVariables);
    // for (let varOcc in variableOccurenceEdges){
    //   if(Math.abs(varOcc['from'])){
    //
    //   }
    // }

    let rawNodes = [];
    for (let i = 1; i <= terms; i++) {
      let shapeValue = 'dot';
      let nodeSize = 30;
      let colorName = 'blue';
      let nodeLabel = '' + i;

      if (tseitinNodesIds.has(i)) {
        shapeValue = 'hexagon';
        nodeSize = 50;
        colorName = 'green';
      } else{
        console.log( primaryVariables[i])
        nodeLabel =    primaryVariables.get(i) + '=' + nodeLabel;
      }

      rawNodes.push({id: i, label: nodeLabel, shape: shapeValue, y: -200, x: i * 150 + 100, color: colorName, size: nodeSize});
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
