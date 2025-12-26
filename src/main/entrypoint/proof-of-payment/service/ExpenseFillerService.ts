/// <reference types="google-apps-script" />
import { ExpenseRepository } from '../../expenses/repository/ExpenseRepository';
import { ProofOfPaymentMapper } from '../mapper/html/ProofOfPaymentMapper';
import { Props } from '../../../commons/constants/Props';
import { ExpenseEntity } from '../../expenses/repository/entity/ExpenseEntity';
import { ProofOfPaymentNotifier } from '../helper/ProofOfPaymentNotifier';
import { Properties } from '../../../commons/properties/Properties';
import { TimeUtil } from '../../../commons/utils/TimeUtil';
import { LastCheckEmailHelper } from '../helper/LastCheckEmailHelper';
import { ApplicationProperties } from '../../../commons/properties/ApplicationProperties';

const ExpenseFillerService = (() => {

  const existingIds = new Set<string>();

  function validateAndInsert(expense: ExpenseEntity): void {
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

  function sendEmail(expense: ExpenseEntity) {
    const to = Properties.get(Props.EMAIL_TO);
    const sendEmail = Properties.get(Props.SEND_EMAIL) === 'true';
    if (sendEmail && to) {
      ProofOfPaymentNotifier.sendNotify(to, expense);
    }
  }

  function fillExpensesAndNotify(): void {
    let lastCheckDate = ApplicationProperties.getLastCheckDate();
    const foundEmails = LastCheckEmailHelper.findEmailsSinceLastCheck();

    foundEmails.forEach((email) => {
      const emailDate = TimeUtil.fromUtcToDate(email.date);

      if (!lastCheckDate || emailDate > lastCheckDate) {
        lastCheckDate = emailDate;
      }

      const expense = ProofOfPaymentMapper.toEntity(email);
      if (!expense || !expense.amount) return;

      validateAndInsert(expense);
      sendEmail(expense);
    });

    ExpenseRepository.sortByExpenseDateDesc();
  }

  return { fillExpensesAndNotify };
})();

export default ExpenseFillerService;