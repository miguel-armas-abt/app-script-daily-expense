import { Strings } from "../constants/Strings";
import { ExpenseRepository } from "../repository/expense/ExpenseRepository";

const ExpenseUpdateService = (() => {

    function updateExpense(payload: {
        gmailMessageId: string;
        category: string;
        comments?: string;
        amount?: string | number;
    }): boolean {
        const gmailMessageId = (payload && payload.gmailMessageId) ? String(payload.gmailMessageId).trim() : Strings.EMPTY;
        const category = (payload && payload.category) ? String(payload.category).trim() : Strings.EMPTY;
        const comments = (payload && payload.comments != null) ? String(payload.comments).trim() : Strings.EMPTY;
        const amountStr = (payload && payload.amount != null) ? String(payload.amount).trim() : Strings.EMPTY;

        if (!gmailMessageId) throw new Error('gmailMessageId is required');
        if (!category) throw new Error('category is required');

        const amountNumber = Number(amountStr);
        if (amountStr && Number.isNaN(amountNumber)) throw new Error('Invalid amount');

        const isUpdated = ExpenseRepository.updateByGmailMessageId(gmailMessageId, category, comments, Number(amountNumber));
        if (!isUpdated) throw new Error('gmailMessageId not found: ' + gmailMessageId);
        return true;
    }

    return { updateExpense: updateExpense };
})();

export default ExpenseUpdateService;