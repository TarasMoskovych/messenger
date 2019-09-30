import { Pipe, PipeTransform } from '@angular/core';
import { RelativeDatePipe } from './relative-date.pipe';

const secondsInAday = 86400;

/*
 * Turn Date into realtive date (e.g. "5 days ago") unless date is
 * more than relativeMax days ago.
 * Support any value supported by Date() object constructor
 *
 * Takes an relative max days argument that defaults to 10.
 * Usage:
 *   value | smartDate:relativeMax
 * Example:
 *   {{ 2016-12-09T13:13:43.572Z |  smartDate:15}}
 *   formats to: '12 days ago'
 * Example2:
 *   {{ 2016-12-09T13:13:43.572Z |  smartDate}}
 *   formats to: '27/11/2016'
 */
@Pipe({ name: 'smartDate' })
export class SmartDatePipe implements PipeTransform {
  transform(dateStamp: number, relativeMax: number = 10): string {
    const timeAgoInSeconds = Math.floor(
      (Date.now() - new Date(dateStamp).getTime()) / 1000
    );

    if (timeAgoInSeconds < relativeMax * secondsInAday) {
      return new RelativeDatePipe().transform(dateStamp);
    } else {
      return new Date(dateStamp).toLocaleDateString('en-GB');
    }
  }
}
