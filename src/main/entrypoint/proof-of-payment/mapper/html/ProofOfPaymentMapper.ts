import { ExpenseEntity } from '../../../expenses/repository/entity/ExpenseEntity';
import { EmailWrapper } from '../../../../commons/gmail/repository/wrapper/EmailWrapper';
import { ProofOfPaymentMapperRegistry } from './ProofOfPaymentMapperRegistry';
import { TimeUtil } from '../../../../commons/utils/TimeUtil';

export const ProofOfPaymentMapper = (() => {

  function toEntity(email: EmailWrapper): ExpenseEntity | undefined {
    const mappers = ProofOfPaymentMapperRegistry.getAll();
    let expense = new ExpenseEntity(email.gmailMessageId, TimeUtil.nowUtc(), email.date, false);
    for (let i = 0; i < mappers.length; i++) {
      const mapper = mappers[i];
      try {

        if (!mapper.supports(email.from, email.subject)) continue;
        mapper.addFields(email.bodyHtml, expense);
      } catch (exception) {
        Logger.log('%s | error=%s', (mapper as any)?.supports?.name || 'unknown', exception);
      }
    }
    return expense;
  }

  return { toEntity };
})();
