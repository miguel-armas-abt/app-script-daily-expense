import { Properties } from "./Properties";
import { Props } from "../constants/Props";
import { TimeUtil } from "../utils/TimeUtil";

export const ApplicationProperties = (() => {

  function invalidPropertyMessage(propertyName: string): string {
    throw new Error(`[ApplicationProperties] Invalid property: ${propertyName}`);
  }

  function getLastCheckDate(): Date {
    const lastCheckDateStr = Properties.getOptional(Props.LAST_CHECK_DATE);
    if (!lastCheckDateStr) {
      throw new Error(invalidPropertyMessage(Props.LAST_CHECK_DATE));
    }
    return new Date(lastCheckDateStr);
  }

  function setLastCheckDate(lastCheckDate: Date) {
    Properties.set(Props.LAST_CHECK_DATE, TimeUtil.fromDateToUtc(lastCheckDate));
  }

  function getGmailPageSize(): number {
    const pageSize = Properties.get(Props.GMAIL_PAGE_SIZE);
    if (!pageSize) {
      throw new Error(invalidPropertyMessage(Props.GMAIL_PAGE_SIZE));
    }
    return Number(pageSize);
  }

  function getCurrenciesJson(): string {
    const currenciesJson = Properties.get(Props.CURRENCIES_JSON);
    if (!currenciesJson) {
      throw new Error(invalidPropertyMessage(Props.CURRENCIES_JSON));
    }
    return currenciesJson;
  }

  function getCategoriesJson(): string {
    const categories = Properties.get(Props.CATEGORIES_JSON);
    if (!categories) {
      throw new Error(invalidPropertyMessage(Props.CATEGORIES_JSON));
    }
    return categories;
  }

  function setCategoriesJson(categoriesJson: string): void {
    Properties.set(Props.CATEGORIES_JSON, categoriesJson);
  }

  return {
    getLastCheckDate,
    setLastCheckDate,
    getGmailPageSize,
    getCurrenciesJson,
    getCategoriesJson,
    setCategoriesJson
  };
})();