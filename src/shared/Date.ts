import moment from 'moment';
import { Moment } from 'moment';
import { goldStoneException } from './GoldStoneException';

export const DATE_FORMAT = 'YYYY-MM-DD';

export class Date implements IDate {
  public static Today(): Date {
    return new Date(moment().format(DATE_FORMAT));
  }

  public static Max(a: Date, b: Date): Date {
    return (a.toString() > b.toString()) ? a : b;
  }

  public static Min(a: Date, b: Date): Date {
    return (a.toString() < b.toString()) ? a : b;
  }

  private date!: string;

  constructor(date: string) {
    const isValidFormat: boolean = moment(date, DATE_FORMAT, /*strict:*/ true).isValid();

    if (isValidFormat === false) {
      throw new goldStoneException(`invalid date format '${date}'. Must be in '${DATE_FORMAT}' format`);
    }

    this.date = date;
  }

  public addDays(days: number): Date {
    const newDate: string = moment(this.date).add(days, 'days').format(DATE_FORMAT);

    return new Date(newDate);
  }

  public addWeeks(weeks: number): Date {
    const newDate: string = moment(this.date).add(weeks, 'weeks').format(DATE_FORMAT);

    return new Date(newDate);
  }

  public addMonths(months: number): Date {
    const newDate: string = moment(this.date).add(months, 'months').format(DATE_FORMAT);

    return new Date(newDate);
  }

  public addYears(years: number): Date {
    const newDate: string = moment(this.date).add(years, 'years').format(DATE_FORMAT);

    return new Date(newDate);
  }

  public toJsDate() {
    return moment(this.date).toDate();
  }

  public toString(): string {
    return this.date;
  }
}

export interface IDate {
  addDays(days: number): Date;
  addWeeks(weeks: number): Date;
  addMonths(months: number): Date;
  addYears(years: number): Date;
  toJsDate();
  toString(): string;
}
