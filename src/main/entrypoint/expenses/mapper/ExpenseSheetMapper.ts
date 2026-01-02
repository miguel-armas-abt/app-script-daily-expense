import { Strings } from "../../../commons/constants/Strings";
import { ExpenseEntity } from "../repository/entity/ExpenseEntity";
import { ExpenseIndex } from "../repository/entity/ExpenseIndex";

export const ExpenseSheetMapper = (() => {

    function toEntity(row: any[]): ExpenseEntity {
        return new ExpenseEntity(
            String(row[ExpenseIndex.COLUMNS.gmailMessageId] ?? Strings.EMPTY),
            String(row[ExpenseIndex.COLUMNS.checkedAt] ?? Strings.EMPTY),
            String(row[ExpenseIndex.COLUMNS.expenseDate] ?? Strings.EMPTY),
            String(row[ExpenseIndex.COLUMNS.category] ?? Strings.EMPTY),
            String(row[ExpenseIndex.COLUMNS.source] ?? Strings.EMPTY),
            String(row[ExpenseIndex.COLUMNS.currency] ?? Strings.EMPTY),
            Number(row[ExpenseIndex.COLUMNS.amount] ?? 0.0),
            String(row[ExpenseIndex.COLUMNS.comments] ?? Strings.EMPTY),
        );
    }

    function toEntities(rows: any[][]): ExpenseEntity[] {
        return rows.map(toEntity);
    }

    return { 
        toEntity,
        toEntities
     };
})();