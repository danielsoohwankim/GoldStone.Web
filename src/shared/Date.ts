import moment from 'moment';
import { Moment } from 'moment';
import { goldStoneException } from './GoldStoneException';

const dateFormat = 'YYYY-MM-DD';

export class Date implements IDate {
  public static Today(): Date {
    return new Date(moment().format(dateFormat));
  }

  private moment!: Moment;

  constructor(date: string) {
    const isValidFormat: boolean = moment(date, dateFormat, /*strict:*/ true).isValid();

    if (isValidFormat === false) {
      throw new goldStoneException(`invalid date format '${date}'. Must be in '${dateFormat}' format`);
    }

    this.moment = moment(date);
  }

  public addDays(days: number): Date {
    const newDate: string = moment(this.moment).add(days, 'days').format(dateFormat);

    return new Date(newDate);
  }

  public addWeeks(weeks: number): Date {
    const newDate: string = moment(this.moment).add(weeks, 'weeks').format(dateFormat);

    return new Date(newDate);
  }

  public addMonths(months: number): Date {
    const newDate: string = moment(this.moment).add(months, 'months').format(dateFormat);

    return new Date(newDate);
  }

  public addYears(years: number): Date {
    const newDate: string = moment(this.moment).add(years, 'years').format(dateFormat);

    return new Date(newDate);
  }

  public toString(): string {
    return this.moment.format(dateFormat);
  }
}

export interface IDate {
  addDays(days: number): Date;
  addWeeks(weeks: number): Date;
  addMonths(months: number): Date;
  addYears(years: number): Date;
  toString(): string;
}
