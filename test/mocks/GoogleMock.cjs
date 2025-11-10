// ===== In-memory Sheet =====
class FakeSheet {

  constructor(name) {
    this.name = name;
    this._rows = []; // save array (each row is an array of cells)
    this._headers = null;
  }

  getName() { return this.name; }

  getLastRow() { return this._rows.length; }

  getLastColumn() {
    return this._rows.length 
    ? this._rows[0].length 
    : (this._headers ? this._headers.length : 0);
  }

  getSheetByName() { return null; }

  // Emula basic range
  getRange(row, col, numRows = 1, numCols = 1) {
    const sheet = this;
    return {
      setValues(values) {
        // header set (row=1 y numRows=1)
        if (row === 1 && numRows === 1) {
          sheet._headers = values[0].slice();
          // ensure rows have same width
          if (sheet._rows.length === 0) sheet._rows = [];
          return this;
        }
        // set of generic cells
        for (let r = 0; r < numRows; r++) {
          const absRow = row - 1 + r;
          while (sheet._rows.length < absRow + 1) sheet._rows.push([]);
          for (let c = 0; c < numCols; c++) {
            const absCol = col - 1 + c;
            while (sheet._rows[absRow].length < absCol + 1) sheet._rows[absRow].push('');
            sheet._rows[absRow][absCol] = values[r][c];
          }
        }
        return this;
      },

      setFontWeight(_w) { return this; },

      setValue(v) {
        // numRows=1, numCols=1 expected
        const absRow = row - 1;
        const absCol = col - 1;
        while (sheet._rows.length < absRow + 1) sheet._rows.push([]);
        while (sheet._rows[absRow].length < absCol + 1) sheet._rows[absRow].push('');
        sheet._rows[absRow][absCol] = v;
        return this;
      },

      getValues() {
        const out = [];
        for (let r = 0; r < numRows; r++) {
          const absRow = row - 1 + r;
          const arr = [];
          for (let c = 0; c < numCols; c++) {
            const absCol = col - 1 + c;
            const val =
              sheet._rows[absRow] && sheet._rows[absRow][absCol] !== undefined
                ? sheet._rows[absRow][absCol]
                : '';
            arr.push(val);
          }
          out.push(arr);
        }
        return out;
      },

      sort(specs) {
        // Supports sort by a column (column:11, ascending:false)
        if (!specs || !specs.length) return this;
        const spec = specs[0];
        const colIndex = spec.column - 1;
        const asc = !!spec.ascending;
        // Sort only the body (exclude headers)
        sheet._rows.sort((a, b) => {
          const va = a[colIndex];
          const vb = b[colIndex];
          const ta = new Date(va).getTime();
          const tb = new Date(vb).getTime();
          return asc ? ta - tb : tb - ta;
        });
        return this;
      }
    };
  }

  appendRow(row) {
    this._rows.push(row.slice());
    return this;
  }

  getDataRange() {
    const rows = this._rows.length;
    const cols = this.getLastColumn();
    return this.getRange(1, 1, rows, cols);
  }
}

class FakeSpreadsheet {

  constructor(title) {
    this.title = title || 'FakeSpreadsheet';
    this._sheets = new Map();
  }

  getSheetByName(name) {
    return this._sheets.get(name) || null;
  }

  insertSheet(name) {
    const sh = new FakeSheet(name);
    this._sheets.set(name, sh);
    return sh;
  }

  getLastRow() {
    // no-op
    return 0;
  }
}

// ===== PropertiesService mock =====
const _scriptProps = new Map();
const PropertiesService = {
  getScriptProperties() {
    return {
      getProperty(key) {
        return _scriptProps.get(key) || null;
      },
      setProperty(key, val) {
        _scriptProps.set(key, String(val));
      }
    };
  }
};

// ===== SpreadsheetApp mock =====
let _activeSpreadsheet = null;
const SpreadsheetApp = {
  getActiveSpreadsheet() {
    return _activeSpreadsheet;
  },
  create(title) {
    _activeSpreadsheet = new FakeSpreadsheet(title);
    return _activeSpreadsheet;
  }
};

// ===== LockService mock =====
const LockService = {
  getScriptLock() {
    return {
      tryLock(_ms) { return true; },
      releaseLock() { }
    };
  }
};

// ===== GmailApp mock =====
const GmailApp = {
  sendEmail(to, subject, body, opts) {
    console.log('[GmailApp.sendEmail]', { to, subject, body, htmlBody: opts && opts.htmlBody });
  }
};

// ===== Utilities mock parcial (gas-local añade uno por defecto; aquí añadimos nowCanonical si hiciera falta) =====
const Utilities = {
  formatDate(date, _tz, fmt) {
    // returns toISOString if requests ISO, else toString
    if (fmt && fmt.includes("yyyy-MM-dd'T'HH:mm:ss'Z'")) return new Date(date).toISOString();
    return new Date(date).toString();
  },
  getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

module.exports = {
  SpreadsheetApp,
  PropertiesService,
  LockService,
  GmailApp,
  Utilities
};
