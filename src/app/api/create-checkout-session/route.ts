import { NextRequest } from "next/server";
import { Stripe } from "stripe";
import { stackServerApp } from "@/auth/stack-auth";
import { db } from "@/db/schema";
import { userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { plan } = await req.json();

    // Check if user already has a Stripe customer ID
    let subscriptionRecord = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, user.id))
      .limit(1)
      .then(results => results[0] || null);

    let customerId = subscriptionRecord?.stripeCustomerId;

    // If no customer ID exists, create a new customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.primaryEmail ?? undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: plan === "yearly" 
            ? process.env.STRIPE_YEARLY_PRICE_ID! 
            : process.env.STRIPE_MONTHLY_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    // Update or create subscription record in our database
    if (subscriptionRecord) {
      await db
        .update(userSubscriptions)
        .set({
          stripeCustomerId: customerId,
          subscriptionType: plan,
        })
        .where(eq(userSubscriptions.userId, user.id));
    } else {
      await db.insert(userSubscriptions).values({
        userId: user.id,
        stripeCustomerId: customerId,
        subscriptionType: plan,
        messageCount: "0",
      });
    }

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}