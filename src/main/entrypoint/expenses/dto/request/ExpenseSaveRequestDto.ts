export class ExpenseSaveRequestDto {
    constructor(
        public category: string,
        public expenseDate: string,
        public currency: string,
        public amount: string,
        public comments?: string,
    ) {}
}