import { ExpenseEntity } from "../repository/entity/ExpenseEntity";
import { ExpenseRepository } from "../repository/ExpenseRepository";
import ExpenseCategoryService from "../service/ExpenseCategoryService";

const ExpenseLimitValidator = (() => {

  function validateIfExistingExpenseIsBelowLimit(
    gmailMessageId: string,
    categoryName: string,
    newExpenseAmount: number
  ): boolean {

    const category = ExpenseCategoryService.findCategory(categoryName);
    const currentExpensesInCategory = findCurrentMonthExpensesByCategory(categoryName);
    const expensesExcludingCurrent = currentExpensesInCategory.filter(ex => ex.gmailMessageId !== gmailMessageId);
    return isTotalBelowCategoryLimit(category, expensesExcludingCurrent, newExpenseAmount);
  }

  function validateIfNewExpenseIsBelowLimit(
    categoryName: string,
    newExpenseAmount: number
  ): boolean {

    const category = ExpenseCategoryService.findCategory(categoryName);
    const currentExpensesInCategory = findCurrentMonthExpensesByCategory(categoryName);
    return isTotalBelowCategoryLimit(category, currentExpensesInCategory, newExpenseAmount);
  }

  function findCurrentMonthExpensesByCategory(categoryName: string): ExpenseEntity[] {
    const firstDayOfMonth = getFirstDayOfCurrentMonthUtc();
    const normalizedCategoryName = String(categoryName).trim();

    return ExpenseRepository
      .findSince(firstDayOfMonth)
      .filter(ex => String(ex.category).trim() === normalizedCategoryName);
  }

  function isTotalBelowCategoryLimit(category: any, currentExpenses: any[], newExpenseAmount: number): boolean {
    const totalExpensesAmount = sumCurrentAmounts(currentExpenses) + Number(newExpenseAmount || 0);
    const categoryLimitAmount = Number(category?.limit || 0);
    return totalExpensesAmount <= categoryLimitAmount;
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

  return {
    validateIfNewExpenseIsBelowLimit,
    validateIfExistingExpenseIsBelowLimit,
  };
})();

export default ExpenseLimitValidator;