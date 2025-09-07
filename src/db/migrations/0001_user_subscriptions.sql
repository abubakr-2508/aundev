-- Migration to add user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    user_id TEXT PRIMARY KEY,
    message_count TEXT NOT NULL DEFAULT '0',
    subscription_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'monthly', 'yearly'
    subscription_status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT
);