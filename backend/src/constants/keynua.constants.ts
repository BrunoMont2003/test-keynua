export const VALIDATION_RULES = {
  documents: {
    min: 1,
    max: 10,
    maxTotalSizeMB: 4.5
  },
  expirationInHours: {
    min: 1
  }
} as const;