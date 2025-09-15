import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/auth/supabase-auth";
import { db } from "@/db/schema";
import { userSubscriptions, appUsers } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return new Response(JSON.stringify({ 
        subscriptionType: "free",
        appCount: 0,
        messageCount: "0",
        subscriptionStatus: "active"
      }), {
        status: 200,
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

    // Get app count for the user
    const appCountResult = await db
      .select({ count: count() })
      .from(appUsers)
      .where(eq(appUsers.userId, user.id))
      .limit(1);

    const appCount = appCountResult[0]?.count || 0;

    // Add app count to the response
    const response = {
      ...subscriptionRecord,
      appCount,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting subscription:", error);
    return new Response(JSON.stringify({ 
      subscriptionType: "free",
      appCount: 0,
      messageCount: "0",
      subscriptionStatus: "active"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}