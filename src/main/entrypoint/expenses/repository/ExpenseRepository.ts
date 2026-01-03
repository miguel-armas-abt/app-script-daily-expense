/// <reference types="google-apps-script" />
import { Properties } from '../../../commons/properties/Properties';
import { Props } from '../../../commons/constants/Props';
import { Strings } from '../../../commons/constants/Strings';
import { ExpenseEntity } from './entity/ExpenseEntity';
import { TimeUtil } from '../../../commons/utils/TimeUtil';
import { ExpenseIndex } from './entity/ExpenseIndex';
import { AppConstants } from '../../../commons/constants/AppConstants';
import { ExpenseSheetMapper } from '../mapper/ExpenseSheetMapper';

export const ExpenseRepository = (() => {

  function getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const sheetName = Properties.get(Props.SHEET_NAME)

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, ExpenseIndex.HEADERS.length).setValues([[...ExpenseIndex.HEADERS]]);
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
        expense.expenseDate,
        expense.isBelowLimit
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
      if (data[i][ExpenseIndex.COLUMNS.gmailMessageId] === expense.gmailMessageId) {
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.amount).setValue(Number(expense.amount));
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.currency).setValue(String(expense.currency.trim()));
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.category).setValue(expense.category);
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.comments).setValue(String(expense.comments).trim());
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.checkedAt).setValue(String(expense.checkedAt).trim());
        sheet.getRange(i + 1, ExpenseIndex.HEADERS_MAP.isBelowLimit).setValue(expense.isBelowLimit);

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

  function readAllRows(): any[][] {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];
    return sheet.getRange(2, 1, lastRow - 1, ExpenseIndex.HEADERS.length).getValues();
  }

  function readTopRows(rowCount: number): any[][] {
    if (rowCount <= 0) return [];
    const sheet = getSheet();
    return sheet.getRange(2, 1, rowCount, ExpenseIndex.HEADERS.length).getValues();
  }

  function findAll(): ExpenseEntity[] {
    return ExpenseSheetMapper.toEntities(readAllRows());
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
        const currentId = String(values[i][ExpenseIndex.COLUMNS.gmailMessageId] ?? Strings.EMPTY);
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

  function findSince(since: Date): ExpenseEntity[] {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];

    const sinceMs = since.getTime();
    const dataRows = lastRow - 1;

    const dateValues = sheet
      .getRange(2, ExpenseIndex.HEADERS_MAP.expenseDate, dataRows, 1)
      .getValues();

    let rowCount = 0;

    for (let i = 0; i < dateValues.length; i++) {
      const cell = dateValues[i][0];
      const cellDate = cell instanceof Date ? cell : new Date(String(cell));
      const cellMs = cellDate.getTime();

      if (Number.isNaN(cellMs)) continue;

      if (cellMs >= sinceMs) {
        rowCount++;
        continue;
      }
      break;
    }

    return ExpenseSheetMapper.toEntities(readTopRows(rowCount));
  }

  return {
    insert,
    updateByGmailMessageId,
    exists,
    sortByExpenseDateDesc,
    findAll,
    findSince,
    deleteByGmailMessageId
  };
})();
