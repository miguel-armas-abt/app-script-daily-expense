export const BBVA = Object.freeze({

    FROM_PROCESSES: "procesos@bbva.com.pe",

    SUBJECT_PLIN: "Constancia de operación transferencia PLIN",
    SUBJECT_QR: "Constancia de pago a comercios con QR",
    SUBJECT_DEBIT_CARD: "Has realizado un consumo con tu tarjeta BBVA",
    SUBJECT_SERVICE_PAYMENT: "BBVA - Constancia Pago de servicios",

} as const)

export const BBVA_PATTERNS = Object.freeze({

    FROM_BBVA_PROCESSES_REGEX: /procesos@bbva\.com\.pe/i,
    SUBJECT_PLIN_REGEX: /plin/i,

} as const)