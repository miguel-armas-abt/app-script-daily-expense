/// <reference types="google-apps-script" />
import { ExpenseRepository } from '../repository/expense/ExpenseRepository';
import { ExpenseBodyMapperHelper } from '../mapper/ExpenseBodyMapperHelper';
import { GmailUtil } from '../utils/GmailUtil';
import { Props } from '../constants/Props';
import { ExpenseEntity } from '../repository/expense/entity/ExpenseEntity';
import { CategorySelectionNotifier } from '../helper/CategorySelectionNotifier';
import { EmailWrapper } from '../repository/gmail/wrapper/EmailWrapper';
import { GmailRepository } from '../repository/gmail/GmailRepository';
import { Properties } from '../config/Properties';
import { TimeUtil } from '../utils/TimeUtil';

const ExpenseFillerService = (() => {

  const existingIds = new Set<string>();

  function validateAndInsert(expense: ExpenseEntity): void {
    if(!expense.gmailMessageId) 
      throw new Error('[fill][service] The field is required: gmailMessageId')

    if (existingIds.has(expense.gmailMessageId))
      return;

    const alreadyExists = ExpenseRepository.exists(expense.gmailMessageId) === true;
    if (alreadyExists) {
      existingIds.add(expense.gmailMessageId);
      return;
    }

    const gmailMessageId = ExpenseRepository.insert(expense);
    existingIds.add(expense.gmailMessageId);

    Logger.log('gmailId=%s | source=%s | amount=%s', gmailMessageId, expense.source, String(expense.amount));
  }

  function sendEmail(expense: ExpenseEntity, email: EmailWrapper) {
    const to = Properties.get(Props.EMAIL_TO_FORWARD);
    const sendEmail = Properties.get(Props.SEND_EMAIL) === 'true';
    if (sendEmail && to) {
      CategorySelectionNotifier.sendEmail(to, expense);
    }
  }

  function fillConstanciesAndNotify(): void {
    const lastCheckDate = TimeUtil.getLastCheckDateUtc();
    const gmailQueries = GmailUtil.getGmailQueriesSinceLastCheck(lastCheckDate);
    const foundEmails = GmailRepository.findMessagesSinceLastCheck(gmailQueries, lastCheckDate);

    foundEmails.forEach((email) => {
      const expense = ExpenseBodyMapperHelper.toEntity(email);
      if (!expense || !expense.amount) return;
      validateAndInsert(expense);
      sendEmail(expense, email);
    });

    ExpenseRepository.sortByExpenseDateDesc();
    Properties.set(Props.LAST_CHECK_DATE, TimeUtil.nowUtcString());
  }

  return { fillConstanciesAndNotify: fillConstanciesAndNotify };
})();

export default ExpenseFillerService;