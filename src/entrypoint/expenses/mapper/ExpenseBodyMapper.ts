import { ExpenseEntity } from '../repository/expense/entity/ExpenseEntity';

export interface ExpenseBodyMapper {

  supports(from: string, subject: string): boolean;
  toEntity(bodyHtml: string): ExpenseEntity;
  
}