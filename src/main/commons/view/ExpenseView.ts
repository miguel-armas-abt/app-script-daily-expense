/// <reference types="google-apps-script" />
import { Properties } from '../properties/Properties';
import { Categories } from '../constants/Categories';
import { DateConstants } from '../constants/DateConstants';
import { Props } from '../constants/Props';
import { Strings } from '../constants/Strings';
import { WebActions } from '../constants/WebAction';
import { TimeUtil } from '../utils/TimeUtil';

const ExpenseView = (() => {

  function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
    const params = (e && e.parameter) || ({} as Record<string, string>);
    const action = params.action || WebActions.SEARCH;

    const tpl = HtmlService.createTemplateFromFile('Index');
    tpl.categories = Categories.DEFAULT_CATEGORIES;
    tpl.defaultDate = Utilities.formatDate(new Date(), DateConstants.TIME_ZONE, 'yyyy-MM-dd');
    tpl.initialTab = action;

    tpl.gmailMessageId = params.gmailMessageId || Strings.EMPTY;
    tpl.amount = params.amount || Strings.EMPTY;
    tpl.currency = params.currency || Strings.EMPTY;
    tpl.expenseDate = params.expenseDate || Strings.EMPTY;
    tpl.source = params.source || Strings.EMPTY;
    tpl.kind = params.kind || Strings.EMPTY;
    tpl.comments = params.comments || Strings.EMPTY;
    tpl.category = params.category || Strings.EMPTY;
    tpl.lastCheckDate = TimeUtil.fromUtcToTimeZoneStr(Properties.get(Props.LAST_CHECK_DATE));

    const output = tpl
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Gestión de gastos');

    output.addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover');
    return output;
  }

  return { doGet: doGet };
})();

export default ExpenseView;