/** @OnlyCurrentDoc */

// fill out expenses
function fillExpensesAndNotify() {
  App.ExpenseFillerService.fillExpensesAndNotify();
}

function createTrigger() {
  App.Trigger.createTrigger('fillExpensesAndNotify');
}

// view
function doGet(e) {
  return App.ExpenseView.doGet(e);
}

function include(filename, data) {
  var t = HtmlService.createTemplateFromFile(filename);
  if (data) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        t[key] = data[key];
      }
    }
  }

  return t.evaluate().getContent();
}

// services consumed by view
function updateExpense(payload) {
  return App.ExpenseUpdateService.updateExpense(payload);
}

function saveExpense(payload) {
  return App.ExpenseSaveService.saveExpense(payload);
}

function findExpensesByFilters(filters) {
  return App.ExpenseSearchService.findExpensesByFilters(filters);
}

function deleteExpense(payload) {
  return App.ExpenseDeleteService.deleteExpense(payload);
}

function getCurrencies() {
  return App.CurrencyService.getCurrencies();
}

function getCategories() {
  return App.ExpenseCategoryService.getCategories();
}

function replaceCategories(payload) {
  App.ExpenseCategoryService.replaceCategories(payload);
}