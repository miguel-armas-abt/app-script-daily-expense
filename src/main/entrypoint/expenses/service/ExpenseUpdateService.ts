import { ExpenseEntity } from "../repository/entity/ExpenseEntity";
import { ExpenseRepository } from "../repository/ExpenseRepository";
import { TimeUtil } from "../../../commons/utils/TimeUtil";

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

        return ExpenseRepository.updateByGmailMessageId(expense);
    }

    return { updateExpense: updateExpense };
})();

export default ExpenseUpdateService;