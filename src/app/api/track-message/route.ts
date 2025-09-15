import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/auth/supabase-auth";
import { db } from "@/db/schema";
import { userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get current message count for the user
    let subscriptionRecord = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, user.id))
      .limit(1)
      .then(results => results[0] || null);

    // If no record exists, create one
    if (!subscriptionRecord) {
      await db.insert(userSubscriptions).values({
        userId: user.id,
        messageCount: "1",
        subscriptionType: "free",
        subscriptionStatus: "active",
      });
    } else {
      // Increment message count
      const currentCount = parseInt(subscriptionRecord.messageCount || "0");
      const newCount = currentCount + 1;
      
      await db
        .update(userSubscriptions)
        .set({
          messageCount: newCount.toString(),
        })
        .where(eq(userSubscriptions.userId, user.id));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error tracking message:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get current message count for the user
    let subscriptionRecord = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, user.id))
      .limit(1)
      .then(results => results[0] || null);

    const messageCount = subscriptionRecord ? parseInt(subscriptionRecord.messageCount || "0") : 0;

    return new Response(JSON.stringify({ messageCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting message count:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}