"use server";

import { db } from "@/db/schema";
import { appsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function renameApp(appId: string, newName: string) {
  if (!appId || !newName) {
    throw new Error("App ID and new name are required");
  }

  if (newName.trim().length === 0) {
    throw new Error("App name cannot be empty");
  }

  try {
    await db
      .update(appsTable)
      .set({ name: newName.trim() })
      .where(eq(appsTable.id, appId));

    revalidatePath("/");
    revalidatePath(`/app/${appId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error renaming app:", error);
    throw new Error("Failed to rename app");
  }
}