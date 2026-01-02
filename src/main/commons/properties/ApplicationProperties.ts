import { Properties } from "./Properties";
import { Props } from "../constants/Props";
import { TimeUtil } from "../utils/TimeUtil";

export const ApplicationProperties = (() => {

  function getProperty(propertyName: string): string {
    const property = Properties.get(propertyName);
    if (!property) {
      throw new Error(`[ApplicationProperties] Invalid property: ${propertyName}`);
    }
    return property;
  }

  function getEmailTo() {
    return getProperty(Props.EMAIL_TO);
  }

  function sendEmail() {
    return getProperty(Props.SEND_EMAIL);
  }

  function getLastCheckDate(): Date {
    return new Date(getProperty(Props.LAST_CHECK_DATE));
  }

  function setLastCheckDate(lastCheckDate: Date) {
    Properties.set(Props.LAST_CHECK_DATE, TimeUtil.fromDateToUtc(lastCheckDate));
  }

  function getGmailPageSize(): number {
    return Number(getProperty(Props.GMAIL_PAGE_SIZE));
  }

  function getCurrenciesJson(): string {
    return getProperty(Props.CURRENCIES_JSON);
  }

  function getCategoriesJson(): string {
    return getProperty(Props.CATEGORIES_JSON);
  }

  function setCategoriesJson(categoriesJson: string): void {
    Properties.set(Props.CATEGORIES_JSON, categoriesJson);
  }

  return {
    getEmailTo,
    sendEmail,
    getLastCheckDate,
    setLastCheckDate,
    getGmailPageSize,
    getCurrenciesJson,
    getCategoriesJson,
    setCategoriesJson
  };
})();