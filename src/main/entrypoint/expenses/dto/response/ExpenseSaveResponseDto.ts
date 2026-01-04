export class ExpenseSaveResponseDto {

  constructor(
    public gmailMessageId: string,
    public isBelowLimit: boolean,
  ) { }
}
