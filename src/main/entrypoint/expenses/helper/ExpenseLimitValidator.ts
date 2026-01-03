import { GmailRepository } from "../../../commons/gmail/repository/GmailRepository";
import { ApplicationProperties } from "../../../commons/properties/ApplicationProperties";
import { ExpenseRepository } from "../repository/ExpenseRepository";
import ExpenseCategoryService from "../service/ExpenseCategoryService";
import { TimeUtil } from "../../../commons/utils/TimeUtil";

const ExpenseLimitValidator = (() => {

  function validateIfBelowLimit(categoryName: string, newExpenseAmount: number): boolean {
    const category = ExpenseCategoryService.findCategory(categoryName);

    const firstDayOfMonth = getFirstDayOfCurrentMonthUtc();
    const currentExpenses = ExpenseRepository
      .findSince(firstDayOfMonth)
      .filter(ex => String(ex.category || '').trim() === categoryName);

    const totalExpensesAmount = sumCurrentAmounts(currentExpenses) + newExpenseAmount;
    const categoryLimitAmount = Number(category.limit || 0);

    const isBelowLimit = totalExpensesAmount <= categoryLimitAmount;

    if (isBelowLimit) {
      return true;

    } else {
      const to = ApplicationProperties.getEmailTo();
      const subject = buildSubject(categoryName, totalExpensesAmount, categoryLimitAmount);
      const htmlBody = buildHtmlBody(categoryName, totalExpensesAmount, categoryLimitAmount, firstDayOfMonth);

      GmailRepository.sendEmail(to, subject, htmlBody);
      return false;
    }
  }

  function getFirstDayOfCurrentMonthUtc(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  }

  function sumCurrentAmounts(expenses: any[]): number {
    let total = 0;
    for (let i = 0; i < (expenses || []).length; i++) {
      total += Number(expenses[i]?.amount || 0);
    }
    return total;
  }

  function formatAmount(amount: number): string {
    const value = Number(amount || 0);
    return value.toFixed(2);
  }

  function buildSubject(categoryName: string, total: number, limit: number): string {
    return '⚠️ Límite superado - '
      + categoryName
      + ' ('
      + formatAmount(total)
      + '/'
      + formatAmount(limit)
      + ')';
  }

  function buildHtmlBody(categoryName: string, total: number, limit: number, since: Date): string {
    const sinceStr = TimeUtil.fromUtcToTimeZoneStr(since);
    const overBy = total - limit;

    const html = [
      '<div style="font-family:Arial,Helvetica,sans-serif;color:#111">',
      '<div style="padding:14px 16px;border-radius:10px;background:#fff3cd;border:1px solid #ffeeba">',
      '<div style="font-size:16px;font-weight:700;margin-bottom:6px">⚠️ Límite mensual superado</div>',
      '<div style="font-size:13px;line-height:1.45">',
      'La categoría <b>', escapeHtml(categoryName), '</b> superó el límite configurado.',
      '<br>',
      'Periodo evaluado: <b>', escapeHtml(sinceStr), '</b> a la fecha.',
      '</div>',
      '</div>',

      '<div style="margin-top:14px;padding:14px 16px;border-radius:10px;border:1px solid #e6e6e6;background:#fff">',
      '<div style="font-size:13px;line-height:1.7">',
      '<b>Total gastado:</b> ', formatAmount(total),
      '<br>',
      '<b>Límite:</b> ', formatAmount(limit),
      '<br>',
      '<b>Exceso:</b> ', formatAmount(overBy),
      '</div>',
      '</div>',

      '<div style="margin-top:14px;font-size:12px;color:#555">',
      'Tip: revisa los gastos de esta categoría y ajusta el límite si es necesario.',
      '</div>',
      '</div>'
    ].join('');

    return html;
  }

  function escapeHtml(value: string): string {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return {
    validateIfBelowLimit,
  };
})();

export default ExpenseLimitValidator;