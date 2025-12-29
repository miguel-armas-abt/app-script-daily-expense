export class CurrencyDto {
    constructor(
        public code: string,
        public symbol: string,
        public description: string,
        public exchangeRate: number
    ) {}
}