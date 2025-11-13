/// <reference types="google-apps-script" />
import { WebAppOptions } from '../constants/WebAppOptions';
import { Strings } from '../constants/Strings';

export function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  const params = (e && e.parameter) || ({} as Record<string, string>);
  const action = params.action || 'search';

  if (action === 'update') {
    const template = HtmlService.createTemplateFromFile('UpdateExpenseUI');
    template.gmailMessageId = params.gmailMessageId || '';
    template.amount = params.amount || Strings.EMPTY;
    template.expenseDate = params.expenseDate || Strings.EMPTY;
    template.source = params.source || Strings.EMPTY;
    template.kind = params.kind || Strings.EMPTY;
    template.categories = WebAppOptions.DEFAULT_CATEGORIES;
    template.comments = params.comments || Strings.EMPTY;
    return template
    .evaluate()
    .setTitle('Actualizar gastos');
  }

  if (action === 'save') {
    const templateNew = HtmlService.createTemplateFromFile('SaveExpenseUI');
    templateNew.categories = WebAppOptions.DEFAULT_CATEGORIES;
    const tz = Session.getScriptTimeZone() || 'America/Lima';
    templateNew.defaultDate = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    return templateNew
    .evaluate()
    .setTitle('Registrar gastos');
  }

  if (action === 'search') {
    const tpl = HtmlService.createTemplateFromFile('SearchExpenseUI');
    tpl.categories = WebAppOptions.DEFAULT_CATEGORIES;
    return tpl
    .evaluate()
    .setTitle('Consultar gastos');
  }

  const html = HtmlService.createHtmlOutput('<div class="err">Acción no soportada.</div>');
  return html.setTitle('Error');
}