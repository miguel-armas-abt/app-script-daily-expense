import type { IExpenseHtmlMapper } from './IExpenseHtmlMapper';
import { BBVADebitCardMapper } from './bbva/BBVADebitCardMapper';
import { BBVAPlinMapper } from './bbva/BBVAPlinMapper';
import { BBVABusinessQRMapper } from './bbva/BBVAMerchantQRMapper';
import { BBVAServicePaymentMapper } from './bbva/BBVAServicePaymentMapper';
import { IBKPlinMapper } from './ibk/IBKPlinMapper';

const MAPPERS: IExpenseHtmlMapper[] = [
  BBVADebitCardMapper,
  BBVAPlinMapper,
  BBVABusinessQRMapper,
  BBVAServicePaymentMapper,
  IBKPlinMapper
];

export const MapperRegistry = (() => {
  function register(mapper: IExpenseHtmlMapper) {
    MAPPERS.push(mapper);
  }

  function getAll(): IExpenseHtmlMapper[] {
    return MAPPERS.slice();
  }

  return { register, getAll };
})();
