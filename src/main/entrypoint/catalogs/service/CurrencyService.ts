import { ApplicationProperties } from "../../../commons/properties/ApplicationProperties";
import { CurrencyDto } from "../dto/CurrencyDto";

const CurrencyService = (() => {

    let cache: CurrencyDto[] | null = null;

    function parseFromSymbol(symbol: string): string {
        const found = getCurrencies().find(c => String(c.symbol).trim() === symbol);

        if (!found)
            throw new Error(`[CurrencyService] No such symbol: ${symbol}`);

        return String(found.code).trim();
    }

    function parseFromCode(code: string): string {
        const found = getCurrencies().find(x => String(x.code).trim().toUpperCase() === code);

        if (!found)
            throw new Error(`[CurrencyService] No such code: ${code}`);

        return String(found.code).trim();
    }

    function getSymbol(currencyCode: string): string {
        const found = getCurrencies().find(x => String(x.code).trim().toUpperCase() === currencyCode);

        if (!found)
            throw new Error(`[CurrencyService] No such currency: ${currencyCode}`);

        return String(found.symbol).trim();
    }

    function getCurrencies(): CurrencyDto[] {
        if (cache) return cache;

        const currenciesJson = ApplicationProperties.getCurrenciesJson();
        const raw = JSON.parse(currenciesJson) as any[];

        const currencies = raw.map(currency => new CurrencyDto(
            String(currency.code),
            String(currency.symbol),
            String(currency.description),
            Number(currency.exchangeRate)
        ));

        cache = currencies;
        return cache;
    }

    return {
        getCurrencies,
        parseFromSymbol,
        parseFromCode,
        getSymbol
    };
})();

export default CurrencyService;