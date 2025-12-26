import { EmailWrapper } from '../repository/wrapper/EmailWrapper';
import { TimeUtil } from '../../utils/TimeUtil';

export const EmailMapper = (() => {

  function toWrapper(message: GoogleAppsScript.Gmail.GmailMessage): EmailWrapper {
    return new EmailWrapper(
      message.getId(),
      TimeUtil.fromGmailDateToUtc(message.getDate()),
      message.getFrom(),
      message.getSubject(),
      message.getBody(),
    )
  }

  return { toWrapper };
})();