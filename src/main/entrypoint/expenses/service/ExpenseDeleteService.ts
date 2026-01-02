import { ExpenseDeleteRequestDto } from "../dto/request/ExpenseDeleteRequestDto";
import { ExpenseRepository } from "../repository/ExpenseRepository";

const ExpenseDeleteService = (() => {

  function deleteExpense(deleteRequest: ExpenseDeleteRequestDto): boolean {
    const gmailMessageId = deleteRequest.gmailMessageId.trim();
    return ExpenseRepository.deleteByGmailMessageId(gmailMessageId);
  }

  return { deleteExpense };
})();

export default ExpenseDeleteService;
