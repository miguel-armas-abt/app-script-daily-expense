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

    function parseFromSymbol(symbol: string): Currency {
        const entry = (Object.entries(CurrencySymbols) as [Currency, string][])
            .find(([, value]) => value === symbol);

        if (!entry)
            throw new Error(`[CurrencyParser] No such symbol: ${symbol}`);

        return entry[0];
    }

    function parseFromCode(code: string): Currency {
        const entry = (Object.entries(CurrencyCodes) as [Currency, string][])
            .find(([, value]) => value === code);

        if (!entry)
            throw new Error(`[CurrencyParser] No such code: ${code}`);

        return entry[0];
    }

    function getSymbol(currency: string): string {
        const symbol = CurrencySymbols[currency as Currency];

        if (!symbol)
            throw new Error(`[CurrencyParser] No such currency: ${currency}`);

        return symbol;
    }

    return {
        parseFromSymbol,
        parseFromCode,
        getSymbol
    };
})();