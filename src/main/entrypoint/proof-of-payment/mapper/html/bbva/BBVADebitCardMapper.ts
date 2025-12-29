import { ExpenseEntity } from '../../../../expenses/repository/entity/ExpenseEntity';
import type { IProofOfPaymentMapper } from '../IProofOfPaymentMapper';
import { Strings } from '../../../../../commons/constants/Strings';
import { BBVAPatterns } from '../../../constants/BBVA';
import CurrencyService from '../../../../catalogs/service/CurrencyService';

export const BBVADebitCardHtml = Object.freeze({

  SUBJECT_REGEX: /Has realizado.*consumo.*tarjeta\s*BBVA/i,
  AMOUNT_REGEX: /Monto:\s*<\/p>\s*<p[^>]*>\s*([0-9]+(?:[.,][0-9]{2})?)/i,
  CURRENCY_REGEX: /Moneda:\s*<\/p>\s*<p[^>]*>\s*([A-Z]{3}|S\/|US\$)/i,
  RECIPIENT_REGEX_P: /Comercio\s*:?\s*<\/p>\s*<p[^>]*>\s*([^<]+)/i,
  RECIPIENT_REGEX_TD: /Comercio\s*:?\s*<\/td>\s*<td[^>]*>\s*([^<]+)/i,

  HTML_NBSP: /&nbsp;|&#160;/gi,
  MULTIPLE_SPACES: /\s+/g,

} as const);

function getAmount(html: string): number {
  const match = html.match(BBVADebitCardHtml.AMOUNT_REGEX);

  if (!match) {
    throw new Error('[BBVADebitCardMapper] Field not matched: amount');
  }

  const amountNumber = Number(match[1]);
  return amountNumber;
}

function getCurrency(html: string): string {
  const match = html.match(BBVADebitCardHtml.CURRENCY_REGEX);

  if (!match) {
    throw new Error('[BBVADebitCardMapper] Field not matched: currency');
  }

  const currencyCode = match[1].toUpperCase();
  return CurrencyService.parseFromCode(currencyCode);
}

function getMerchantName(html: string): string {
  const merchantMatch =
    html.match(BBVADebitCardHtml.RECIPIENT_REGEX_P) ||
    html.match(BBVADebitCardHtml.RECIPIENT_REGEX_TD);

  if (!merchantMatch)
    return Strings.EMPTY;

  const rawMerchantName = merchantMatch[1];

  const normalizedMerchantName = rawMerchantName
    .replace(BBVADebitCardHtml.HTML_NBSP, Strings.SPACE)
    .replace(BBVADebitCardHtml.MULTIPLE_SPACES, Strings.SPACE)
    .trim();

  return normalizedMerchantName;
}

export const BBVADebitCardMapper: IProofOfPaymentMapper = {

  supports(from: string, subject: string): boolean {
    return BBVAPatterns.FROM_BBVA_PROCESSES_REGEX.test(from) &&
      BBVADebitCardHtml.SUBJECT_REGEX.test(subject);
  },

  addFields(bodyHtml: string, expense: ExpenseEntity): void  {
    const amount = getAmount(bodyHtml);
    const currency = getCurrency(bodyHtml);
    const merchantName = getMerchantName(bodyHtml);

    expense.amount = amount;
    expense.currency = currency;
    expense.source = 'BBVA - CONSUMO DE TARJETA DEBITO';
    expense.comments = merchantName;
  }
};
