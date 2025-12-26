import { CurrencyParser } from "../enums/Currency";
import { ExpenseEntity } from "../repository/entity/ExpenseEntity";
import { TimeUtil } from "../../../commons/utils/TimeUtil";
import { ExpenseSearchResponseDto } from "../dto/ExpenseSearchResponseDto";

export const ExpenseSearchMapper = (() => {

    function toDto(expense: ExpenseEntity): ExpenseSearchResponseDto {
        return new ExpenseSearchResponseDto(
            expense.gmailMessageId,
            TimeUtil.fromUtcToTimeZoneStr(expense.expenseDate),
            expense.category,
            expense.source,
            expense.currency,
            CurrencyParser.getSymbol(expense.currency),
            expense.amount,
            expense.comments
        );
    }

    return { toDto };
})();