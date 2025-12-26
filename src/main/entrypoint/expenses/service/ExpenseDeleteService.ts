import { ExpenseRepository } from "../repository/ExpenseRepository";

const ExpenseDeleteService = (() => {

  function deleteExpense(payload: { gmailMessageId: string } | string): boolean {
    const gmailMessageId = (typeof payload === 'string')
      ? String(payload || '').trim()
      : String((payload && payload.gmailMessageId) || '').trim();

    return ExpenseRepository.deleteByGmailMessageId(gmailMessageId);
  }

  return { deleteExpense };
})();

export default ExpenseDeleteService;
