import { NextRequest } from "next/server";
import { stackServerApp } from "@/auth/stack-auth";
import { db } from "@/db/schema";
import { userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get subscription information for the user
    let subscriptionRecord = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, user.id))
      .limit(1)
      .then(results => results[0] || null);

    // If no record exists, create a default free subscription
    if (!subscriptionRecord) {
      subscriptionRecord = {
        userId: user.id,
        messageCount: "0",
        subscriptionType: "free",
        subscriptionStatus: "active",
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      };
    }

    return new Response(JSON.stringify(subscriptionRecord), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting subscription:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}