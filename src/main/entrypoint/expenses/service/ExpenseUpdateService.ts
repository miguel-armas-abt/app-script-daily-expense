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

        const expense = new ExpenseEntity(payload.gmailMessageId);
        expense.category = String(payload.category).trim();
        expense.amount = Number(String(payload.amount).trim());
        expense.currency = String(payload.currency).trim();
        expense.comments = String(payload.comments).trim();
        expense.checkedAt = TimeUtil.nowUtc();

        const id = ExpenseRepository.updateByGmailMessageId(expense);
        ExpenseLimitValidator.validateLimit(payload.category);
        return id;
    }

    return { updateExpense: updateExpense };
})();

export default ExpenseUpdateService;