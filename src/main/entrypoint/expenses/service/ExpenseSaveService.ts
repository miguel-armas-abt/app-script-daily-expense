import { ExpenseEntity } from "../repository/entity/ExpenseEntity";
import { ExpenseRepository } from "../repository/ExpenseRepository";
import { AppConstants } from "../../../commons/constants/AppConstants";
import { TimeUtil } from "../../../commons/utils/TimeUtil";

const ExpenseSaveService = (() => {

    function saveExpense(payload: {
        category: string;
        expenseDate: string;
        currency: string;
        amount: string;
        comments?: string;
    }): string {

        const expense = new ExpenseEntity(
            Utilities.getUuid(),
            TimeUtil.nowUtc(),
            TimeUtil.fromYyyyMmDdToUtcStr(payload.expenseDate),
            String(payload.category).trim(),
            AppConstants.MANUALLY,
            payload.currency,
            Number(String(payload.amount).trim()),
            String(payload.comments).trim()
        );

        const createdId = ExpenseRepository.insert(expense);
        if (!createdId) 
            throw new Error('[ExpenseSaveService] Record could not be saved.');

        ExpenseRepository.sortByExpenseDateDesc();
        return createdId;
    }

    return { saveExpense };
})();

export default ExpenseSaveService;