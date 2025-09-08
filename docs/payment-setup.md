# Payment Gateway Setup for AUN.AI Pro

This document explains how to set up and configure the Stripe payment gateway for the AUN.AI Pro subscription feature.

## Prerequisites

1. A Stripe account (sign up at [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register))
2. AUN.AI application running with all dependencies installed

## Setup Instructions

### 1. Obtain Stripe API Keys

1. Log in to your Stripe Dashboard
2. Navigate to Developers > API Keys
3. Copy the following keys:
   - Publishable key (starts with `pk_`)
   - Secret key (starts with `sk_`)

### 2. Create Subscription Products and Prices

1. In your Stripe Dashboard, go to Products
2. Create two recurring products:
   - **Monthly Plan**: $25 per month
   - **Yearly Plan**: $250 per year

3. Note down the Price IDs for both plans:
   - Monthly Price ID (starts with `price_`)
   - Yearly Price ID (starts with `price_`)

### 3. Configure Webhook Endpoint

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Add a new endpoint with the following details:
   - Endpoint URL: `https://your-domain.com/api/webhook` (or `http://localhost:3000/api/webhook` for local development)
   - Events to listen to:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`

3. Copy the webhook signing secret (starts with `whsec_`)

### 4. Update Environment Variables

Add the following variables to your `.env` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Product IDs (Prices)
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id_here
STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id_here

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Database Migration

The payment feature requires a new `user_subscriptions` table. Run the following command to update your database schema:

```bash
npx drizzle-kit push
```

## How It Works

### Message Tracking

The system tracks user messages and shows the upgrade prompt after 10 messages. The message count is stored in the `user_subscriptions` table.

### Upgrade Flow

1. After 10 messages, the upgrade prompt automatically appears
2. User can choose between monthly ($25) or yearly ($250) plans
3. User is redirected to Stripe Checkout
4. After successful payment, user is redirected to the success page
5. Subscription information is stored in the database

### Subscription Management

Users can manage their subscriptions through the dashboard component on the home page.

## Testing

For testing purposes, Stripe provides test API keys and test card numbers:

- Test card number: `4242 4242 4242 4242`
- Any valid expiration date and CVC

### Testing Without Webhook Access

If you don't have webhook access or domain access yet, you can still test the Stripe functionality:

#### 1. Using Stripe CLI (Recommended)

The Stripe CLI allows you to test webhooks locally:

1. Install Stripe CLI from [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Login to Stripe CLI:
   ```
   stripe login
   ```
3. Start listening to webhooks:
   ```
   stripe listen --forward-to localhost:3000/api/webhook
   ```
4. The CLI will provide a webhook signing secret to use in your `.env` file

#### 2. Manual Testing Approach

If you can't use Stripe CLI, you can test the checkout flow manually:

1. Complete the checkout process using test card numbers
2. Check the Stripe Dashboard to verify payment success
3. Manually update your database to reflect subscription status
4. Test application behavior with updated subscription status

#### 3. Local Development Testing

Since you're using localhost, you can test the complete flow:

1. Ensure `NEXT_PUBLIC_BASE_URL` is set to `http://localhost:3000`
2. Test the upgrade prompt appearing after 10 messages
3. Test redirecting to Stripe Checkout
4. Use test card numbers to complete payments
5. Verify the success/cancel redirects work correctly

## Troubleshooting

### Webhook Issues

If webhooks are not being received:

1. Check that your endpoint URL is publicly accessible
2. Verify the webhook signing secret matches
3. Check the Stripe Dashboard for webhook delivery logs

### Database Issues

If there are issues with the subscription tracking:

1. Ensure the `user_subscriptions` table exists
2. Verify database connection settings
3. Check that the database user has proper permissions

## Security Considerations

1. Never expose secret keys in client-side code
2. Always verify webhook signatures
3. Use HTTPS in production
4. Regularly rotate API keys