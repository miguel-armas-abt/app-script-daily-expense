import { ExpenseEntity } from '../../../../expenses/repository/entity/ExpenseEntity';
import type { IProofOfPaymentMapper } from '../IProofOfPaymentMapper';
import { Strings } from '../../../../../commons/constants/Strings';
import { BBVAPatterns } from '../../../constants/BBVA';
import CurrencyService from '../../../../catalogs/service/CurrencyService';

export const BBVAPlinHtml = Object.freeze({

  SUBJECT_REGEX: /\bplin\s*$/i,
  AMOUNT_AND_CURRENCY_REGEX: /Plineaste\s*(S\/|\$)&nbsp;?([0-9]+(?:[.,][0-9]{2})?)/i,
  RECIPIENT_REGEX: /(?:&nbsp;|\s)*a(?:&nbsp;|\s)+([^<\r\n]+)/i,

  HTML_NBSP: /&nbsp;|&#160;/gi,
  MULTIPLE_SPACES: /\s+/g,

} as const);

function getAmountAndCurrency(html: string): {
  amount: number;
  currency: string;
  matchEndIndex: number;
} {
  const match = html.match(BBVAPlinHtml.AMOUNT_AND_CURRENCY_REGEX);
  if (!match || match.index == null) {
    throw new Error('[BBVAPlinMapper] Field not matched: amount & currency');
  }

  const currencySymbol = match[1];
  const amountNumber = Number(match[2]);
  const currencyCode = CurrencyService.parseFromSymbol(currencySymbol);

  const matchEndIndex = match.index + match[0].length;

  return {
    amount: amountNumber,
    currency: currencyCode,
    matchEndIndex,
  };
}

function getRecipient(html: string, startIndex: number): string {
  const tailHtml = html.slice(startIndex);

  const recipientMatch = tailHtml.match(BBVAPlinHtml.RECIPIENT_REGEX);
  if (!recipientMatch)
    return Strings.EMPTY;

  const rawRecipient = recipientMatch[1];

  const normalizedRecipient = rawRecipient
    .replace(BBVAPlinHtml.HTML_NBSP, Strings.SPACE)
    .replace(BBVAPlinHtml.MULTIPLE_SPACES, Strings.SPACE)
    .trim();

  return normalizedRecipient;
}

export const BBVAPlinMapper: IProofOfPaymentMapper = {

  supports(from: string, subject: string): boolean {
    return BBVAPatterns.FROM_BBVA_PROCESSES_REGEX.test(from) &&
      BBVAPlinHtml.SUBJECT_REGEX.test(subject);
  },

  addFields(bodyHtml: string, expense: ExpenseEntity): void  {
    const { amount, currency, matchEndIndex } = getAmountAndCurrency(bodyHtml);
    const recipient = getRecipient(bodyHtml, matchEndIndex);

    expense.amount = amount;
    expense.currency = currency,
    expense.source = 'BBVA - PLIN',
    expense.comments = recipient;
  }
};
