export const CurrencyCodes = Object.freeze({
    PEN: "PEN",
    USD: "USD",
} as const)

export type Currency = keyof typeof CurrencyCodes;

export const CurrencySymbols: Record<Currency, string> = Object.freeze({
    PEN: "S/",
    USD: "$",
})

export const CurrencyParser = (() => {

    function parse(symbol: string): Currency {
        const entry = (Object.entries(CurrencySymbols) as [Currency, string][])
            .find(([, value]) => value === symbol);

        if (!entry)
            throw new Error(`[currency-parser] No such symbol: ${symbol}`);

        return entry[0];
    }
    
  return { parse };
})();