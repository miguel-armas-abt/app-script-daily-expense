/// <reference types="google-apps-script" />
import { TriggerConfig } from './config/TriggerConfig';
import { ExpenseFillerService } from './service/ExpenseFillerService';

// fill out expenses
export function fillConstanciesAndNotify(): void {
  ExpenseFillerService.fillConstanciesAndNotify();
}

export function createTrigger(): void {
  TriggerConfig.createTrigger('fillConstanciesAndNotify');
}
