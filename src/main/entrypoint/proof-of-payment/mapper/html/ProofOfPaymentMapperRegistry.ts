import type { IProofOfPaymentMapper } from './IProofOfPaymentMapper';
import { BBVADebitCardMapper } from './bbva/BBVADebitCardMapper';
import { BBVAPlinMapper } from './bbva/BBVAPlinMapper';
import { BBVABusinessQRMapper } from './bbva/BBVAMerchantQRMapper';
import { BBVAServicePaymentMapper } from './bbva/BBVAServicePaymentMapper';
import { BCPCreditCardMapper } from './bcp/BCPCreditCardMapper';
import { BCPDebitCardMapper } from './bcp/BCPDebitCardMapper';
import { BCPYapeMapper } from './bcp/BCPYapeMapper';
import { BCPYapePaymentMapper } from './bcp/BCPYapeServiceMapper';
import { IBKPlinMapper } from './ibk/IBKPlinMapper';

const MAPPERS: IProofOfPaymentMapper[] = [
  BBVADebitCardMapper,
  BBVAPlinMapper,
  BBVABusinessQRMapper,
  BBVAServicePaymentMapper,
  BCPCreditCardMapper,
  BCPDebitCardMapper,
  BCPYapeMapper,
  BCPYapePaymentMapper,
  IBKPlinMapper
];

export const ProofOfPaymentMapperRegistry = (() => {
  function register(mapper: IProofOfPaymentMapper) {
    MAPPERS.push(mapper);
  }

  function getAll(): IProofOfPaymentMapper[] {
    return MAPPERS.slice();
  }

  return { register, getAll };
})();
