import { TimeUtil } from '../../../commons/utils/TimeUtil';
import { GmailConstants } from '../constants/GmailConstants';

export const GmailQuery = (() => {

  function searchAfterDate(emailDate: Date): string[] {
    const afterPart = ' after:' + TimeUtil.fromDateToGmailDateStr(emailDate);
    return GmailConstants.GMAIL_QUERIES.map((q) => q + afterPart);
  }

  return { searchAfterDate: searchAfterDate };
})();
