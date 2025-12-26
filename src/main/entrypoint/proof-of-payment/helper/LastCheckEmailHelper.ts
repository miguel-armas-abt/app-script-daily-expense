import { GmailRepository } from "../../../commons/gmail/repository/GmailRepository";
import { EmailWrapper } from "../../../commons/gmail/repository/wrapper/EmailWrapper";
import { ApplicationProperties } from "../../../commons/properties/ApplicationProperties";
import { TimeUtil } from "../../../commons/utils/TimeUtil";
import { GmailQuery } from "../utils/GmailQuery";

export const LastCheckEmailHelper = (() => {

  function findEmailsSinceLastCheck(): Set<EmailWrapper> {
    const initialLastCheckDate = ApplicationProperties.getLastCheckDate();
    const gmailQueries = GmailQuery.searchAfterDate(initialLastCheckDate);
    const pageSize = ApplicationProperties.getGmailPageSize();
    const emails = GmailRepository.findEmails(gmailQueries, pageSize);

    const latestById = new Map<string, { email: EmailWrapper; date: Date }>();
    let newLastCheckDate = initialLastCheckDate;

    for (const email of emails) {
      const emailDate = TimeUtil.fromUtcToDate(email.date);
      if (emailDate <= initialLastCheckDate) {
        continue;
      }

      const current = latestById.get(email.gmailMessageId);
      if (!current || emailDate > current.date) {
        latestById.set(email.gmailMessageId, { email, date: emailDate });
      }

      if (!newLastCheckDate || emailDate > newLastCheckDate) {
        newLastCheckDate = emailDate;
      }
    }

    ApplicationProperties.setLastCheckDate(newLastCheckDate);
    return new Set(Array.from(latestById.values(), v => v.email));
  }

  return { findEmailsSinceLastCheck };
})();