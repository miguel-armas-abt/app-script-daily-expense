import { ExpenseEntity } from "../repository/entity/ExpenseEntity";
import { ExpenseRepository } from "../repository/ExpenseRepository";
import { TimeUtil } from "../../../commons/utils/TimeUtil";
import ExpenseLimitValidator from "../helper/ExpenseLimitValidator";

const ExpenseUpdateService = (() => {

    function updateExpense(payload: {
        gmailMessageId: string;
        category: string;
        comments?: string;
        currency?: string;
        amount?: string;
    }): boolean {

        const expenseAmount = Number(String(payload.amount).trim());
        const isBelowLimit = ExpenseLimitValidator.validateIfExistingExpenseIsBelowLimit(payload.gmailMessageId, payload.category, expenseAmount);

        const expense = new ExpenseEntity(payload.gmailMessageId);
        expense.isBelowLimit = isBelowLimit;
        expense.category = String(payload.category).trim();
        expense.amount = expenseAmount;
        expense.currency = String(payload.currency).trim();
        expense.comments = String(payload.comments).trim();
        expense.checkedAt = TimeUtil.nowUtc();

        const id = ExpenseRepository.updateByGmailMessageId(expense);
        
        return id;
    }

    return { updateExpense };
})();

export default ExpenseUpdateService;