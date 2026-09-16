export const config = {
  receiptValidityMinutes: Number(process.env.DEFAULT_RECEIPT_VALIDITY_MINUTES ?? 20),
  allowedClockSkewSeconds: Number(process.env.ALLOWED_CLOCK_SKEW_SECONDS ?? 90),
  pointsPerLitre: Number(process.env.DEFAULT_POINTS_PER_LITRE ?? 1),
  receiptVerifyRateLimitPerMinute: Number(process.env.RECEIPT_VERIFY_RATE_LIMIT_PER_MINUTE ?? 10),
  receiptImageMaxBytes: Number(process.env.RECEIPT_IMAGE_MAX_BYTES ?? 5_242_880)
};
