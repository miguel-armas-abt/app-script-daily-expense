import { ExpenseEntity } from '../../../expenses/repository/entity/ExpenseEntity';

export interface IProofOfPaymentMapper {

  supports(from: string, subject: string): boolean;
  addFields(bodyHtml: string, expense: ExpenseEntity): void;
  
}