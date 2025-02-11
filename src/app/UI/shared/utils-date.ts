import moment from 'moment';
import { DateRange } from '../../shared/domain/models/pagination/DateRange';

export function getStartDayWithTimezone(): string {
  // Inicia el día en la zona local y formatea la fecha incluyendo el offset
  return moment().startOf('day').format('YYYY-MM-DD[T]HH:mm:ssZ');
}

export function getEndDayWithTimezone(): string {
  // Inicia el día en la zona local y formatea la fecha incluyendo el offset
  return moment().endOf('day').format('YYYY-MM-DD[T]HH:mm:ssZ');
}

export function getStartDayStartLastDays(days: number): string {
  return moment()
    .subtract(days, 'days')
    .startOf('day')
    .format('YYYY-MM-DD[T]HH:mm:ssZ');
}

export function getDateRangeFromDay(day: string): DateRange {
  const startDate = moment(day).startOf('day').format('YYYY-MM-DD[T]HH:mm:ssZ');
  const endDate = moment(day).endOf('day').format('YYYY-MM-DD[T]HH:mm:ssZ');
  return { startDate, endDate };
}

/**
 * Formats a date to string in a consistent way
 * @param date Date to format
 * @returns Formatted date string
 */
export function getDateAsString(date: any): string {
  if (!date) return '';

  try {
    // Use moment to parse and format the date
    return moment(date).format('MM/DD/YYYY HH:mm:ss');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
