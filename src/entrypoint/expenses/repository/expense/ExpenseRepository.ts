/// <reference types="google-apps-script" />
import { Properties } from '../../config/Properties';
import { Props } from '../../constants/Props';
import { AppConstants } from '../../constants/AppConstants';
import { Strings } from '../../constants/Strings';
import { ExpenseDto } from '../../dto/ExpenseDto';
import { TimeUtil } from '../../utils/TimeUtil';

export const ExpenseRepository = (() => {
  function getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const sheetName = Properties.get(Props.SHEET_NAME)

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    const headers = [
      'gmailMessageId',
      'checkedAt',
      'source',
      'currency',
      'amount',
      'category',
      'comments',
      'expenseDate'
    ];

    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    return sh;
  }

  function exists(gmailMessageId: string): boolean {
    if (!gmailMessageId) return false;
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return false;

    const range = sheet.getRange(2, 1, lastRow - 1, 1);
    const values = range.getValues();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][0]) === String(gmailMessageId)) return true;
    }
    return false;
  }

  function insert(expense: ExpenseDto, date: Date): string {
    const sheet = getSheet();
    const lock = LockService.getScriptLock();
    lock.tryLock(28 * 1000);
    try {
      if (exists(expense.gmailMessageId)) return expense.gmailMessageId;

      const row = [
        expense.gmailMessageId,
        TimeUtil.now(),
        expense.source,
        expense.currency,
        expense.amount,
        expense.category || AppConstants.DEFAULT,
        expense.comments || Strings.EMPTY,
        TimeUtil.toString(date)
      ];
      sheet.appendRow(row);
      return expense.gmailMessageId;
    } finally {
      lock.releaseLock();
    }
  }

  function updateByGmailMessageId(
    gmailMessageId: string,
    newCategory: string,
    newComments: string,
    newAmount: number
  ): boolean {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === gmailMessageId) {
        sheet.getRange(i + 1, 5).setValue(Number(newAmount));
        sheet.getRange(i + 1, 6).setValue(newCategory);
        sheet.getRange(i + 1, 7).setValue(String(newComments).trim());
        return true;
      }
    }
    return false;
  }

  function sortByExpenseDateDesc(): void {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow <= 1) return;
    const range = sheet.getRange(2, 1, lastRow - 1, lastCol);
    range.sort([{ column: 8, ascending: false }]);
  }

  function insertWithDateString(expense: ExpenseDto, dateStr: string): string {
    const sheet = getSheet();
    const lock = LockService.getScriptLock();
    lock.tryLock(28 * 1000);
    try {
      if (exists(expense.gmailMessageId)) return expense.gmailMessageId;

      // Normaliza a 'yyyy-MM-dd' → Date en timezone del script
      const tz = Session.getScriptTimeZone() || 'America/Lima';
      const jsDate = new Date(dateStr + 'T00:00:00'); // compatible con formato de tu UI

      const row = [
        expense.gmailMessageId,
        TimeUtil.now(),                  // checkedAt = ahora
        expense.source,
        expense.currency,
        expense.amount,
        expense.category || AppConstants.DEFAULT,
        expense.comments || Strings.EMPTY,
        Utilities.formatDate(jsDate, tz, 'yyyy-MM-dd') // guardamos limpio para filtro
      ];
      sheet.appendRow(row);
      return expense.gmailMessageId;
    } finally {
      lock.releaseLock();
    }
  }

  function listAll(): Array<{
    gmailMessageId: string;
    checkedAt: string;
    source: string;
    currency: string;
    amount: number;
    category: string;
    comments: string;
    expenseDate: string;
  }> {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];

    const values = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
    // Mapea filas a objetos
    return values.map(r => ({
      gmailMessageId: String(r[0] ?? ''),
      checkedAt: String(r[1] ?? ''),
      source: String(r[2] ?? ''),
      currency: String(r[3] ?? ''),
      amount: Number(r[4] ?? 0),
      category: String(r[5] ?? ''),
      comments: String(r[6] ?? ''),
      expenseDate: String(r[7] ?? ''),
    }));
  }

  return { insert, updateByGmailMessageId, exists, sortByExpenseDateDesc, insertWithDateString, listAll};
})();
