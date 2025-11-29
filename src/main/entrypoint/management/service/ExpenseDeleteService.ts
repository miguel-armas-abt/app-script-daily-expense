import { ExpenseRepository } from "../../../commons/repository/expense/ExpenseRepository";

const ExpenseDeleteService = (() => {

  function deleteExpense(payload: { gmailMessageId: string } | string): boolean {
    const gmailMessageId = (typeof payload === 'string')
      ? String(payload || '').trim()
      : String((payload && payload.gmailMessageId) || '').trim();

    if (!gmailMessageId)
      throw new Error('[delete][service] The field is required: gmailMessageId');

    const deleted = ExpenseRepository.deleteByGmailMessageId(gmailMessageId);
    if (!deleted)
      throw new Error('[delete][service] Record could not be deleted: ' + gmailMessageId);

    return true;
  }

  return { deleteExpense };
})();

export default ExpenseDeleteService;
