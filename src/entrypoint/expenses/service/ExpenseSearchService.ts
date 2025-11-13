import { Strings } from "../constants/Strings";
import { ExpenseRepository } from "../repository/expense/ExpenseRepository";

const ExpenseSearchService = (() => {

    type ExpenseFilters = {
        whatEverText?: string;
        from?: string;   // yyyy-MM-dd
        to?: string;     // yyyy-MM-dd
        category?: string;
        page?: number;
        pageSize?: number;
    }

    function findExpensesByFilters(filters: ExpenseFilters): {
        items: any[];
        total: number;
        totalPages: number;
        page: number;
    } {
        const page = Math.max(1, Number(filters?.page || 1));
        const pageSize = Math.max(1, Math.min(100, Number(filters?.pageSize || 10)));
        const whatEverText = (filters?.whatEverText || Strings.EMPTY).toLowerCase().trim();
        const category = (filters?.category || Strings.EMPTY).toLowerCase().trim();
        const from = (filters?.from || Strings.EMPTY).trim(); // yyyy-MM-dd
        const to = (filters?.to || Strings.EMPTY).trim();     // yyyy-MM-dd

        const allExpenses = ExpenseRepository.findAll();
        const filteredExpenses = allExpenses.filter(expense => {
            const textOk = !whatEverText || [
                String(expense.category || Strings.EMPTY).toLowerCase(),
                String(expense.comments || Strings.EMPTY).toLowerCase(),
                String(expense.source || Strings.EMPTY).toLowerCase(),
            ].some(s => s.includes(whatEverText));

            const catOk = !category || String(expense.category || '').toLowerCase() === category;

            const date = expense.expenseDate ? new Date(expense.expenseDate) : null;
            const fromOk = !from || (date && date >= new Date(from + 'T00:00:00'));
            const toOk = !to || (date && date <= new Date(to + 'T23:59:59'));
            return textOk && catOk && fromOk && toOk;
        })

        filteredExpenses.sort((a, b) => {
            const da = a.expenseDate ? new Date(a.expenseDate).getTime() : 0;
            const db = b.expenseDate ? new Date(b.expenseDate).getTime() : 0;
            return db - da;
        });

        const total = filteredExpenses.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const start = (page - 1) * pageSize;
        const items = filteredExpenses.slice(start, start + pageSize);

        return { items, total, totalPages, page };
    }

    return { findExpensesByFilters: findExpensesByFilters };
})();

export default ExpenseSearchService;