import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modifyText'
})
export class ModifyTextPipe implements PipeTransform {
  
  transform(value: string, keyword: string, addition: string): string {
    if (value && value.includes(keyword)) {
      return value + addition;
    }
    return value;
  }

}
