export class ExpenseSearchResponseDto {

  constructor(
    public gmailMessageId: string,
    public expenseDate: string,
    public category: string,
    public source: string,
    public currency: string,
    public currencySymbol: string,
    public amount: number,
    public comments: string,
  ) { }
}
