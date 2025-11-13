/** @OnlyCurrentDoc */

// fill out expenses
function fillConstanciesAndNotify() {
  App.expenseFillerService.ExpenseFillerService.fillConstanciesAndNotify();
}

function createTrigger() {
  App.triggerConfig.TriggerConfig.createTrigger('fillConstanciesAndNotify');
}

// view
function doGet(e) {
  return App.expenseView.doGet(e);
}

// services consumed by view
function updateExpense(payload) {
  return App.expenseUpdateService.ExpenseUpdateService.updateExpense(payload);
}

function saveExpense(payload) {
  return App.expenseSaveService.ExpenseSaveService.saveExpense(payload);
}

function findExpensesByFilters(filters) {
  return App.expenseSearchService.ExpenseSearchService.findExpensesByFilters(filters);
}