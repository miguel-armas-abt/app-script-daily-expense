import { ExpenseEntity } from "../repository/entity/ExpenseEntity";
import { TimeUtil } from "../../../commons/utils/TimeUtil";
import { ExpenseSearchResponseDto } from "../dto/response/ExpenseSearchResponseDto";
import CurrencyService from "../../catalogs/service/CurrencyService";

export const ExpenseSearchMapper = (() => {

    function toDto(expense: ExpenseEntity): ExpenseSearchResponseDto {
        return new ExpenseSearchResponseDto(
            expense.gmailMessageId,
            TimeUtil.fromUtcToTimeZoneStr(expense.expenseDate),
            expense.category,
            expense.source,
            expense.currency,
            CurrencyService.getSymbol(expense.currency),
            expense.amount,
            expense.comments
        );
    }

    return { toDto };
})();