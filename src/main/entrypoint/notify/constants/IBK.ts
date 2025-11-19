export const IBK = Object.freeze({

    FROM_CUSTOMER_SERVICE: "servicioalcliente@netinterbank.com.pe",

    SUBJECT_PLIN: "Constancia de Pago Plin",

} as const)

export const IBKPatterns = Object.freeze({

    FROM_IBK_CUSTOMER_SERVICE_REGEX: /servicioalcliente@netinterbank\.com\.pe/i,
    SUBJECT_PLIN_REGEX: /plin/i,

} as const)