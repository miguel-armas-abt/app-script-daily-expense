/// <reference types="google-apps-script" />
import { Strings } from '../../constants/Strings';
import { EmailMapper } from '../mapper/EmailMapper';
import { EmailWrapper } from './wrapper/EmailWrapper';

export const GmailRepository = (() => {

  function sendEmail(to: string, subject: string, htmlBody: string) {
    GmailApp.sendEmail(
      to,
      subject,
      Strings.EMPTY,
      { htmlBody: htmlBody }
    );
  }

  function findEmails(
    gmailQueries: string[],
    pageSize: number): Set<EmailWrapper> {

    const gmailMessages = new Map<string, GoogleAppsScript.Gmail.GmailMessage>();

    gmailQueries.forEach((gmailQuery) => {
      let start = 0;

      while (true) {
        const threads = GmailApp.search(gmailQuery, start, pageSize);
        if (!threads || threads.length === 0) {
          break;
        }

        threads.forEach((thread) => {
          thread.getMessages().forEach((message) => {
            gmailMessages.set(message.getId(), message);
          })
        });

        if (threads.length < pageSize) {
          break;
        }

        start += pageSize;
      }
    });

    const emails = new Set<EmailWrapper>();
    gmailMessages.forEach((msg) => {
      const email = EmailMapper.toWrapper(msg);
      emails.add(email);
    });

    return emails;
  }

  return {
    sendEmail,
    findEmails
  };
})();
