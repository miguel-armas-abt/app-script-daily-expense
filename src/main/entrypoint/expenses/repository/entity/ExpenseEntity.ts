import { Strings } from '../../../../commons/constants/Strings';

export class ExpenseEntity {

  gmailMessageId: string;
  checkedAt: string;
  expenseDate: string;
  isBelowLimit: boolean;
  category: string;
  source: string;
  currency: string;
  amount: number;
  comments: string;

  constructor(
    gmailMessageId: string,
    checkedAt: string = Strings.EMPTY, 
    expenseDate: string = Strings.EMPTY,
    isBelowLimit: boolean = true,
    category: string = Strings.EMPTY,
    source: string = Strings.EMPTY,
    currency: string = Strings.EMPTY,
    amount: number = 0.00,
    comments: string = Strings.EMPTY) {

    this.gmailMessageId = gmailMessageId;
    this.checkedAt = checkedAt;
    this.expenseDate = expenseDate;
    this.isBelowLimit = isBelowLimit;
    this.category = category;
    this.source = source;
    this.currency = currency;
    this.amount = amount;
    this.comments = comments;
  }
}
