import { Strings } from '../../../commons/constants/Strings.js';
import { GmailRepository } from '../../../commons/gmail/repository/GmailRepository.js';
import { Props } from '../../../commons/constants/Props.js';
import { ExpenseEntity } from '../../expenses/repository/entity/ExpenseEntity.js';
import { Properties } from '../../../commons/properties/Properties.js';
import { TimeUtil } from '../../../commons/utils/TimeUtil.js';
import { WebActions } from '../../../commons/constants/WebAction.js';
import CurrencyService from '../../catalogs/service/CurrencyService.js';

export const ProofOfPaymentNotifier = (() => {

    function buildURL(params: Record<string, string | number>) {
        const baseUrl = Properties.get(Props.WEBAPP_BASE_URL);

        const queryParams = Object.keys(params)
            .map((key) => encodeURIComponent(key) + Strings.EQUAL + encodeURIComponent(String(params[key])))
            .join(Strings.AMPERSAND);

        return baseUrl
            + (baseUrl.indexOf(Strings.QUESTION_MARK) > -1 ? Strings.AMPERSAND : Strings.QUESTION_MARK)
            + queryParams;
    }

    function sendNotify(to: string, expense: ExpenseEntity) {
        const expenseDate = TimeUtil.fromUtcToTimeZoneStr(expense.expenseDate);
        const url = buildURL({
            action: WebActions.UPDATE,
            gmailMessageId: expense.gmailMessageId,
            amount: expense.amount,
            expenseDate: expenseDate,
            source: expense.source,
            comments: expense.comments || Strings.EMPTY,
        });

        const html =
            [
                '<div style="font-family:Arial,Helvetica,sans-serif">',
                '<p><b>Importe:</b> ',
                CurrencyService.getSymbol(expense.currency), expense.amount,
                '<br>',
                '<b>Fecha:</b> ',
                expenseDate,
                '<br>',
                '<b>Origen:</b> ',
                expense.source,
                '<br>',
                '<b>Destino:</b> ',
                expense.comments || Strings.EMPTY,
                '<br>',
                '<b>Gmail ID:</b> ',
                expense.gmailMessageId,
                '<br>',
                '<p>',
                '<a href="',
                url,
                `" style="display:inline-block;padding:10px 16px;border-radius:6px;background:#1973b8;color:#fff;text-decoration:none;font-weight:bold" target="_blank">`,
                'Elegir categoría</a>',
                '</p>',
                '</div>'
            ].join('');

        const subject = 'Categoría de gasto - '
            + expense.source + Strings.SPACE
            + expense.amount;

        GmailRepository.sendEmail(to, subject, html);
    }

    return { sendNotify: sendNotify };
})();