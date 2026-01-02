import { ExpenseEntity } from "../repository/entity/ExpenseEntity";
import { ExpenseRepository } from "../repository/ExpenseRepository";
import { AppConstants } from "../../../commons/constants/AppConstants";
import { TimeUtil } from "../../../commons/utils/TimeUtil";
import ExpenseLimitValidator from "../helper/ExpenseLimitValidator";
import { ExpenseSaveRequestDto } from "../dto/request/ExpenseSaveRequestDto";

const ExpenseSaveService = (() => {

    function saveExpense(saveRequest: ExpenseSaveRequestDto): string {

        const expense = new ExpenseEntity(
            Utilities.getUuid(),
            TimeUtil.nowUtc(),
            TimeUtil.fromYyyyMmDdToUtcStr(saveRequest.expenseDate),
            String(saveRequest.category).trim(),
            AppConstants.MANUALLY,
            saveRequest.currency,
            Number(String(saveRequest.amount).trim()),
            String(saveRequest.comments).trim()
        );

        const createdId = ExpenseRepository.insert(expense);
        if (!createdId) 
            throw new Error('[ExpenseSaveService] Record could not be saved.');

        ExpenseRepository.sortByExpenseDateDesc();
        ExpenseLimitValidator.validateLimit(saveRequest.category.trim());
        return createdId;
    }

    return { saveExpense };
})();

export default ExpenseSaveService;