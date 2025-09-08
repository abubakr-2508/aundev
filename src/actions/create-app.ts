"use server";

import { getUser } from "@/auth/stack-auth";
import { appsTable, appUsers } from "@/db/schema";
import { db } from "@/db/schema";
import { freestyle } from "@/lib/freestyle";
import { templates } from "@/lib/templates";
import { memory, builderAgent } from "@/mastra/agents/builder";
import { sendMessageWithStreaming } from "@/lib/internal/stream-manager";
import { count, eq } from "drizzle-orm";

export async function createApp({
  initialMessage,
  templateId,
}: {
  initialMessage?: string;
  templateId?: string;
}) {
  console.time("get user");
  const user = await getUser();
  console.timeEnd("get user");

  // Check user's subscription and app count
  console.time("check subscription");
  const subscriptionResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-subscription`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!subscriptionResponse.ok) {
    throw new Error("Failed to fetch subscription information");
  }

  const subscription = await subscriptionResponse.json();
  console.timeEnd("check subscription");

  // Check if user has reached app limit (3 for free, unlimited for pro)
  const isFreeUser = subscription.subscriptionType === "free";
  const appCount = subscription.appCount || 0;
  
  if (isFreeUser && appCount >= 3) {
    throw new Error("Free plan limit reached. You can only create 3 apps. Please upgrade to Pro for unlimited apps.");
  }

  // Validate and default templateId
  let validTemplateId = templateId;
  if (!validTemplateId || typeof validTemplateId !== 'string') {
    validTemplateId = 'nextjs'; // default template
  }

  if (!templates[validTemplateId]) {
    throw new Error(
      `Template ${validTemplateId} not found. Available templates: ${Object.keys(templates).join(", ")}`
    );
  }

  console.time("git");
  const repo = await freestyle.createGitRepository({
    name: "Unnamed App",
    public: true,
    source: {
      type: "git",
      url: templates[validTemplateId].repo,
    },
  });
  await freestyle.grantGitPermission({
    identityId: user.freestyleIdentity,
    repoId: repo.repoId,
    permission: "write",
  });

  const token = await freestyle.createGitAccessToken({
    identityId: user.freestyleIdentity,
  });

  console.timeEnd("git");

  console.time("dev server");
  const { mcpEphemeralUrl, fs } = await freestyle.requestDevServer({
    repoId: repo.repoId,
  });
  console.timeEnd("dev server");

  console.time("database: create app");
  const app = await db.transaction(async (tx) => {
    const appInsertion = await tx
      .insert(appsTable)
      .values({
        gitRepo: repo.repoId,
        name: initialMessage,
      })
      .returning();

    await tx
      .insert(appUsers)
      .values({
        appId: appInsertion[0].id,
        userId: user.userId,
        permissions: "admin",
        freestyleAccessToken: token.token,
        freestyleAccessTokenId: token.id,
        freestyleIdentity: user.freestyleIdentity,
      })
      .returning();

    return appInsertion[0];
  });
  console.timeEnd("database: create app");

  console.time("mastra: create thread");
  await memory.createThread({
    threadId: app.id,
    resourceId: app.id,
  });
  console.timeEnd("mastra: create thread");

  if (initialMessage) {
    console.time("send initial message");

    // Send the initial message using the same infrastructure as the chat API
    await sendMessageWithStreaming(builderAgent, app.id, mcpEphemeralUrl, fs, {
      id: crypto.randomUUID(),
      parts: [
        {
          text: initialMessage,
          type: "text",
        },
      ],
      role: "user",
    });

    console.timeEnd("send initial message");
  }

  return app;
}