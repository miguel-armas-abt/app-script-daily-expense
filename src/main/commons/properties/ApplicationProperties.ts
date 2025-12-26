import { Properties } from "./Properties";
import { Props } from "../constants/Props";
import { TimeUtil } from "../utils/TimeUtil";

export const ApplicationProperties = (() => {

  function getLastCheckDate(): Date {
    const lastCheckDateStr = Properties.getOptional(Props.LAST_CHECK_DATE);
    if (!lastCheckDateStr) {
      throw new Error('[properties] last check date is not configured');
    }
    return new Date(lastCheckDateStr);
  }

  function setLastCheckDate(lastCheckDate: Date) {
    Properties.set(Props.LAST_CHECK_DATE, TimeUtil.fromDateToUtc(lastCheckDate));
  }

  function getGmailPageSize(): number {
    const pageSize = Properties.get(Props.GMAIL_PAGE_SIZE)
    if (!pageSize) {
      throw new Error('[properties] gmail page size is not configured');
    }
    return Number(Properties.get(Props.GMAIL_PAGE_SIZE));
  }

  return {
    getLastCheckDate,
    setLastCheckDate,
    getGmailPageSize
  };
})();