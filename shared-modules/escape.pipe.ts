import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({ name: 'escape' })
export class EscapePipe implements PipeTransform {
  transform(value: string, args:string[]): any {
    return (!value) ? '' : value.replace(/[^A-Z0-9]+/ig, "_")
 }
}