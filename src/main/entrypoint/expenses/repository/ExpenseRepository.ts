/// <reference types="google-apps-script" />
import { Properties } from '../../../commons/properties/Properties';
import { Props } from '../../../commons/constants/Props';
import { Strings } from '../../../commons/constants/Strings';
import { ExpenseEntity } from './entity/ExpenseEntity';
import { TimeUtil } from '../../../commons/utils/TimeUtil';
import { ExpenseIndex } from './entity/ExpenseIndex';
import { AppConstants } from '../../../commons/constants/AppConstants';

export const ExpenseRepository = (() => {

  function getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const sheetName = Properties.get(Props.SHEET_NAME)

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, ExpenseIndex.HEADERS.length).setValues([ [...ExpenseIndex.HEADERS] ]);
      sh.getRange(1, 1, 1, ExpenseIndex.HEADERS.length).setFontWeight('bold');
    }
    return sh;
  }

  function exists(gmailMessageId: string): boolean {
    if (!gmailMessageId) return false;
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return false;

    const range = sheet.getRange(2, ExpenseIndex.HEADERS_MAP.gmailMessageId, lastRow - 1, 1);
    const values = range.getValues();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][0]) === String(gmailMessageId)) return true;
    }
    return false;
  }

  function insert(expense: ExpenseEntity): string {
    const sheet = getSheet();
    const lock = LockService.getScriptLock();
    lock.waitLock(28 * 1000);

    try {
      if (exists(expense.gmailMessageId))
        throw new Error('[ExpenseRepository] Record already exists: ' + expense.gmailMessageId)

      const row = [
        expense.gmailMessageId,
        expense.checkedAt || TimeUtil.nowUtc(),
        expense.source,
        expense.currency,
        expense.amount,
        expense.category || AppConstants.UNDEFINED,
        expense.comments || Strings.EMPTY,
        expense.expenseDate
      ];
      sheet.appendRow(row);
      return expense.gmailMessageId;
    } finally {
      lock.releaseLock();
    }
  }

  function updateByGmailMessageId(expense: ExpenseEntity): boolean {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      const gmailColIndex = ExpenseIndex.HEADERS_MAP.gmailMessageId - 1;
      if (data[i][gmailColIndex] === expense.gmailMessageId) {
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.amount).setValue(Number(expense.amount));
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.currency).setValue(String(expense.currency.trim()));
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.category).setValue(expense.category);
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.comments).setValue(String(expense.comments).trim());
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.checkedAt).setValue(String(expense.checkedAt).trim());
        
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
    range.sort([{ column: ExpenseIndex.HEADERS_MAP.expenseDate, ascending: false }]);
  }

  function findAll(): ExpenseEntity[] {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];

    const values = sheet.getRange(2, 1, lastRow - 1, ExpenseIndex.HEADERS.length).getValues();

    return values.map(r => new ExpenseEntity(
      String(r[ExpenseIndex.HEADERS_MAP.gmailMessageId - 1] ?? Strings.EMPTY),
      String(r[ExpenseIndex.HEADERS_MAP.checkedAt - 1] ?? Strings.EMPTY),
      String(r[ExpenseIndex.HEADERS_MAP.expenseDate - 1] ?? Strings.EMPTY),
      String(r[ExpenseIndex.HEADERS_MAP.category - 1] ?? Strings.EMPTY),
      String(r[ExpenseIndex.HEADERS_MAP.source - 1] ?? Strings.EMPTY),
      String(r[ExpenseIndex.HEADERS_MAP.currency - 1] ?? Strings.EMPTY),
      Number(r[ExpenseIndex.HEADERS_MAP.amount - 1] ?? 0.0),
      String(r[ExpenseIndex.HEADERS_MAP.comments - 1] ?? Strings.EMPTY),      
    ));
  }

    function deleteByGmailMessageId(gmailMessageId: string): boolean {
    if (!gmailMessageId) return false;

    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return false;

    const lock = LockService.getScriptLock();
    lock.waitLock(28 * 1000);

    try {
      const range = sheet.getRange(2, 1, lastRow - 1, ExpenseIndex.HEADERS.length);
      const values = range.getValues();

      for (let i = 0; i < values.length; i++) {
        const currentId = String(values[i][ExpenseIndex.HEADERS_MAP.gmailMessageId - 1] ?? Strings.EMPTY);
        if (currentId === String(gmailMessageId)) {
          sheet.deleteRow(i + 2);
          return true;
        }
      }
      return false;
    } finally {
      lock.releaseLock();
    }
  }

  return {
    insert,
    updateByGmailMessageId,
    exists,
    sortByExpenseDateDesc,
    findAll,
    deleteByGmailMessageId
  };
})();
