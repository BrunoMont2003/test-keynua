import { timingSafeEqual, createHmac } from 'crypto';

/**
 * Constant-time string comparison to prevent timing attacks
 */
export const constantTimeEqual = (a: string, b: string): boolean => {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
};

/**
 * Generate HMAC-SHA256 signature for webhook verification
 */
export const generateHmacSignature = (payload: string, secret: string): string => {
  return createHmac('sha256', secret).update(payload).digest('hex');
};

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  const expectedSignature = generateHmacSignature(payload, secret);
  return constantTimeEqual(signature, expectedSignature);
};
