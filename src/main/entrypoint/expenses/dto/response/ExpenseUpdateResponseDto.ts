export class ExpenseUpdateResponseDto {

  constructor(
    public isUpdated: boolean,
    public isBelowLimit: boolean,
  ) { }
}
