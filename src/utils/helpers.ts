import { RateCard } from '@skyrise-eng/types';

export const getSkipLimit = (pagination: { limit?: number; page: number }) => ({
  skip: (pagination.page - 1) * (pagination?.limit ?? 0),
  limit: pagination.limit ?? 0
});

export const trimStartEnd = <T extends { [key: string]: string }>(obj: T, field: string | string[]): T => {
  if (Array.isArray(field)) {
    return Object.assign(
      obj,
      field.reduce((acc, f) => ({ ...acc, [f]: obj[f].trimStart().trimEnd() }), {})
    );
  }
  return Object.assign(obj, { [field]: obj[field].trimStart().trimEnd() });
};

export const roundNumber = (number: number, digit: number = 2) => {
  const multiplier = 10 ** digit;

  return Math.round(number * multiplier) / multiplier;
};

export const isRateCardDraft = (rateCard: RateCard) => {
  const fields = ['channel', 'product', 'buyingMetric', 'formats', 'kpis', 'sellRate', 'buyRate'] as const;
  const arrayFields = ['formats', 'kpis'] as const;

  return fields.some((field) => !rateCard[field]) || arrayFields.some((field) => !rateCard[field]?.length);
};

export const splitByChunks = <T>(chunks: Array<T>, chunkSize: number): T[][] => {
  let index = 0;
  const array: T[][] = [];
  while (index < chunks.length) {
    array.push(chunks.slice(index, chunkSize + index));
    index += chunkSize;
  }

  return array;
};

export const formatNumber = (value: number, minimumFractionDigits: number = 2): string =>
  value.toLocaleString('en-US', { minimumFractionDigits });
