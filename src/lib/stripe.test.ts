import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Stripe } from 'stripe';

// Mock the environment variables
process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key';

describe('Stripe Integration', () => {
  let stripe: Stripe;

  beforeEach(() => {
    // Initialize Stripe with a fake key for testing
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    });
  });

  it('should initialize Stripe correctly', () => {
    expect(stripe).toBeDefined();
    // @ts-ignore - accessing private property for testing
    expect(stripe._api.version).toBe('2025-08-27.basil');
  });

  it('should have the correct API key', () => {
    // @ts-ignore - accessing private property for testing
    expect(stripe._api.key).toBe('sk_test_fake_key');
  });
});