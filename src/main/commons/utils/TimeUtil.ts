/// <reference types="google-apps-script" />
import { DateConstants } from '../constants/DateConstants';

export const TimeUtil = (() => {

  const MONTHS_SHORT_ES = Object.freeze([
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ] as const);

  function fromUtcToDate(utcString: string): Date {
    return new Date(utcString);
  }

  function fromDateToUtc(date: Date): string {
    return Utilities.formatDate(date, DateConstants.UTC, DateConstants.ISO_UTC_8601_FORMAT);
  }

  function nowUtc(): string {
    return fromDateToUtc(new Date());
  }

  function fromDateToGmailDateStr(date: Date): string {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  }

  function fromGmailDateToUtc(date: GoogleAppsScript.Base.Date): string {
    return Utilities.formatDate(date, DateConstants.UTC, DateConstants.ISO_UTC_8601_FORMAT);
  }

  function fromUtcToTimeZoneStr(utcString: string | Date): string {
    const date = new Date(utcString);
    const tz = DateConstants.TIME_ZONE;

    const dd = Utilities.formatDate(date, tz, 'dd');
    const mm = Number(Utilities.formatDate(date, tz, 'MM')) - 1;
    const yyyy = Utilities.formatDate(date, tz, 'yyyy');

    return `${dd} ${MONTHS_SHORT_ES[mm]} ${yyyy}`;
  }

  function fromYyyyMmDdToUtcStr(dateString: string): string {
    const date = String(dateString || '').trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`[TimeUtil] Invalid date format (expected yyyy-MM-dd): ${date}`);
    }

    const [y, m, d] = date.split('-').map(Number);
    const now = new Date();
    const combined = new Date(
      y,
      m - 1,
      d,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );

    return Utilities.formatDate(combined, DateConstants.UTC, DateConstants.ISO_UTC_8601_FORMAT);
  }

  return {
    fromUtcToDate,
    fromDateToUtc,
    nowUtc: nowUtc,
    fromDateToGmailDateStr,
    fromGmailDateToUtc,
    fromUtcToTimeZoneStr,
    fromYyyyMmDdToUtcStr
  };
})();
