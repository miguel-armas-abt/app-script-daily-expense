export const ExpenseIndex = (() => {

  const HEADERS = [
    'gmailMessageId',
    'checkedAt',
    'source',
    'currency',
    'amount',
    'category',
    'comments',
    'expenseDate'
  ] as const;

  type HeaderKey = typeof HEADERS[number];

  const HEADERS_MAP: Record<HeaderKey, number> = HEADERS.reduce((acc, key, idx) => {
    acc[key] = idx + 1;
    return acc;
  }, {} as Record<HeaderKey, number>);

  const COLUMNS = {
    gmailMessageId: HEADERS_MAP.gmailMessageId - 1,
    checkedAt: HEADERS_MAP.checkedAt - 1,
    expenseDate: HEADERS_MAP.expenseDate - 1,
    category: HEADERS_MAP.category - 1,
    source: HEADERS_MAP.source - 1,
    currency: HEADERS_MAP.currency - 1,
    amount: HEADERS_MAP.amount - 1,
    comments: HEADERS_MAP.comments - 1,
  } as const;

  return {
    HEADERS_MAP: HEADERS_MAP,
    HEADERS,
    COLUMNS
  };
})();