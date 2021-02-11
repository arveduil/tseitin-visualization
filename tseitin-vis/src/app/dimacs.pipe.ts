import {Pipe, PipeTransform} from '@angular/core';
import {isNumeric} from 'tslint';

@Pipe({
  name: 'dimacs'
})
export class DimacsPipe implements PipeTransform {

  transform(value: string, tseitinVar: Set<number>): string {
    const res: string = [...value].map(c => {
        if (tseitinVar.has(+c)) {
          return '(' + c + ')';
        } else {
          return c;
        }
      }
    ).join('');

    return res;
  }
}
