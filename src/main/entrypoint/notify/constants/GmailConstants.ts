import { BBVA } from "./BBVA";
import { IBK } from "./IBK";

export const GmailConstants = Object.freeze({

  GMAIL_QUERIES: [
    `from:${BBVA.FROM_PROCESSES} subject:"${BBVA.SUBJECT_PLIN}"`,
    `from:${IBK.FROM_CUSTOMER_SERVICE} subject:"${IBK.SUBJECT_PLIN}"`,
    `from:${BBVA.FROM_PROCESSES} subject:"${BBVA.SUBJECT_QR}"`,
    `from:${BBVA.FROM_PROCESSES} subject:"${BBVA.SUBJECT_DEBIT_CARD}"`,
    `from:${BBVA.FROM_PROCESSES} subject:"${BBVA.SUBJECT_SERVICE_PAYMENT}"`,
  ],
});


