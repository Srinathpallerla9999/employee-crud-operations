import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employee'
})
export class EmployeePipe implements PipeTransform {
  transform(value: any): any {
    if (!value) return value;

    // Convert underscores to spaces and capitalize each word
    const transformedValue = value.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (char: any) => char.toUpperCase());

    return transformedValue;
  }
}
