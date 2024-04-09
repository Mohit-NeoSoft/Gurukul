import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceAmp'
})
export class ReplaceAmpPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/&amp;/g, '-');
  }

}
