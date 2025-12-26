/// <reference types="google-apps-script" />
import { DateConstants } from '../constants/DateConstants';

export const TimeUtil = (() => {

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
    return Utilities.formatDate(new Date(utcString), DateConstants.TIME_ZONE, DateConstants.TIME_ZONE_FORMAT);
  }

  function fromYyyyMmDdToUtcStr(dateString: string): string {
    const date = String(dateString || '').trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`[TimeUtil] Invalid date format (expected yyyy-MM-dd): ${date}`);
    }

    const [y, m, d] = date.split('-').map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
    return Utilities.formatDate(utcDate, DateConstants.UTC, DateConstants.ISO_UTC_8601_FORMAT);
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
