/// <reference types="google-apps-script" />
import { ExpenseRepository } from '../repository/expense/ExpenseRepository';
import { WebAppOptions } from '../constants/WebAppOptions';
import { Strings } from '../constants/Strings';
import { ExpenseDto } from '../dto/ExpenseDto';
import { CurrencyConstants } from '../enums/Currency';

type SearchFilters = {
  q?: string;
  from?: string;   // yyyy-MM-dd
  to?: string;     // yyyy-MM-dd
  category?: string;
  page?: number;
  pageSize?: number;
};

// === WebApp (doGet) y endpoints ===
export function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  const params = (e && e.parameter) || ({} as Record<string, string>);
  const action = params.action || 'search';

  if (action === 'edit') {
    const template = HtmlService.createTemplateFromFile('WebAppUpdateExpenseTemplate');
    template.gmailMessageId = params.gmailMessageId || '';
    template.amount = params.amount || Strings.EMPTY;
    template.expenseDate = params.expenseDate || Strings.EMPTY;
    template.source = params.source || Strings.EMPTY;
    template.kind = params.kind || Strings.EMPTY;
    template.categories = WebAppOptions.DEFAULT_CATEGORIES;
    template.comments = params.comments || Strings.EMPTY;
    return template.evaluate().setTitle('Categorizar gasto');
  }

  if (action === 'new') {
    const templateNew = HtmlService.createTemplateFromFile('WebAppSaveExpenseTemplate');
    templateNew.categories = WebAppOptions.DEFAULT_CATEGORIES;
    const tz = Session.getScriptTimeZone() || 'America/Lima';
    templateNew.defaultDate = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    return templateNew.evaluate().setTitle('Registrar nuevo gasto');
  }

  if (action === 'search') {
    const tpl = HtmlService.createTemplateFromFile('WebAppSearchExpensesTemplate');
    tpl.categories = WebAppOptions.DEFAULT_CATEGORIES;
    return tpl.evaluate().setTitle('Consulta de gastos');
  }

  const html = HtmlService.createHtmlOutput('<div class="err">Acción no soportada.</div>');
  return html.setTitle('Error');
}

export function saveExpenseCategory(payload: {
  gmailMessageId: string;
  category: string;
  comments?: string;
  amount?: string | number;
}): boolean {
  const gmailMessageId = (payload && payload.gmailMessageId) ? String(payload.gmailMessageId).trim() : '';
  const category = (payload && payload.category) ? String(payload.category).trim() : '';
  const comments = (payload && payload.comments != null) ? String(payload.comments).trim() : '';
  const amountRaw = (payload && payload.amount != null) ? String(payload.amount).trim() : '';

  if (!gmailMessageId) throw new Error('gmailMessageId is required');
  if (!category) throw new Error('category is required');

  const amountNumber = Number(amountRaw);
  if (amountRaw && Number.isNaN(amountNumber)) throw new Error('Invalid amount');

  const isUpdated = ExpenseRepository.updateByGmailMessageId(gmailMessageId, category, comments, Number(amountNumber));
  if (!isUpdated) throw new Error('gmailMessageId not found: ' + gmailMessageId);
  return true;
}

export function saveNewExpense(payload: {
  amount: string;
  category: string;
  comments?: string;
  source?: string;
  expenseDate: string;
}): string {
  const amountRaw = (payload && payload.amount != null) ? String(payload.amount).trim() : '';
  const category = (payload && payload.category) ? String(payload.category).trim() : '';
  const comments = (payload && payload.comments != null) ? String(payload.comments).trim() : '';
  const dateStr = (payload && payload.expenseDate != null) ? String(payload.expenseDate).trim() : '';

  if (!amountRaw) throw new Error('amount is required');
  if (!category) throw new Error('category is required');
  if (!dateStr) throw new Error('expenseDate is required');

  const amountNum = Number(amountRaw);
  if (Number.isNaN(amountNum)) throw new Error('Invalid amount');

  const expense = new ExpenseDto({
    gmailMessageId: Utilities.getUuid(),
    source: WebAppOptions.MANUALLY,
    amount: amountNum,
    currency: CurrencyConstants.CURRENCY_PEN,
    comments,
    category
  });

  // Guardamos usando la fecha enviada (col. expenseDate) y checkedAt (ahora)
  const createdId = ExpenseRepository.insertWithDateString(expense, dateStr);
  if (!createdId) throw new Error('The expense could not be recorded.');
  ExpenseRepository.sortByExpenseDateDesc();
  return createdId;
}

/**
 * Endpoint para la tabla (consulta + paginación)
 */
export function getExpenses(filters: SearchFilters): {
  items: any[];
  total: number;
  totalPages: number;
  page: number;
} {
  const page = Math.max(1, Number(filters?.page || 1));
  const pageSize = Math.max(1, Math.min(100, Number(filters?.pageSize || 10)));
  const q = (filters?.q || '').toLowerCase().trim();
  const category = (filters?.category || '').toLowerCase().trim();
  const from = (filters?.from || '').trim(); // yyyy-MM-dd
  const to = (filters?.to || '').trim();     // yyyy-MM-dd

  const all = ExpenseRepository.listAll(); // objetos completos
  // Filtros in-memory
  const filtered = all.filter(row => {
    // Texto: busca en categoría, comments y source
    const textOk = !q || [
      String(row.category || '').toLowerCase(),
      String(row.comments || '').toLowerCase(),
      String(row.source || '').toLowerCase(),
    ].some(s => s.includes(q));

    // Categoría exacta si viene
    const catOk = !category || String(row.category || '').toLowerCase() === category;

    // Rango de fechas (columna expenseDate). Soporta 'yyyy-MM-dd' o ISO.
    const d = row.expenseDate ? new Date(row.expenseDate) : null;
    const fromOk = !from || (d && d >= new Date(from + 'T00:00:00'));
    const toOk = !to || (d && d <= new Date(to + 'T23:59:59'));

    return textOk && catOk && fromOk && toOk;
  });

  // Orden por fecha desc (como tu función sortByExpenseDateDesc)
  filtered.sort((a, b) => {
    const da = a.expenseDate ? new Date(a.expenseDate).getTime() : 0;
    const db = b.expenseDate ? new Date(b.expenseDate).getTime() : 0;
    return db - da;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total, totalPages, page };
}
