import { NextRequest } from "next/server";
import { Stripe } from "stripe";
import { db } from "@/db/schema";
import { userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update the user's subscription status in our database
      const userId = session.metadata?.userId;
      if (userId) {
        await db
          .update(userSubscriptions)
          .set({
            subscriptionStatus: "active",
            subscriptionStartDate: new Date(),
            stripeSubscriptionId: session.subscription as string,
          })
          .where(eq(userSubscriptions.userId, userId));
      }
      break;
    }
    
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Update the user's subscription status to cancelled
      const userId = subscription.metadata?.userId;
      if (userId) {
        await db
          .update(userSubscriptions)
          .set({
            subscriptionStatus: "cancelled",
            subscriptionEndDate: new Date(),
          })
          .where(eq(userSubscriptions.userId, userId));
      }
      break;
    }
    
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      
      // You could extend this to handle successful payments
      console.log(`Payment succeeded for invoice ${invoice.id}`);
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}