import { createApp } from "@/actions/create-app";
import { redirect } from "next/navigation";
import { getUser } from "@/auth/supabase-auth";

// This page is never rendered. It is used to:
// - Force user login without losing the user's initial message and template selection.
// - Force a loading page to be rendered (loading.tsx) while the app is being created.
export default async function NewAppRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>;
  params: Promise<{ id: string }>;
}) {
  const user = await getUser().catch(() => undefined);
  const search = await searchParams;

  if (!user) {
    // reconstruct the search params
    const newParams = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => newParams.append(key, v));
      } else {
        newParams.set(key, value);
      }
    });

    // After sign in, redirect back to this page with the initial search params
    redirect(
      `/handler/sign-in?after_auth_return_to=${encodeURIComponent(
        "/app/new?" + newParams.toString()
      )}`
    );
  }

  let message: string | undefined;
  if (Array.isArray(search.message)) {
    message = search.message[0];
  } else {
    message = search.message;
  }

  // Ensure template is defined and valid, default to "nextjs" if not
  let templateId: string;
  if (Array.isArray(search.template)) {
    templateId = search.template[0];
  } else {
    templateId = search.template as string;
  }

  // Validate template or use default
  if (!templateId || typeof templateId !== 'string') {
    templateId = 'nextjs';
  }

  try {
    const { id } = await createApp({
      initialMessage: message ? decodeURIComponent(message) : undefined,
      templateId,
    });

    redirect(`/app/${id}`);
  } catch (error: any) {
    // If it's an app limit error, redirect to a special page or show upgrade option
    if (error.message && error.message.includes("Free plan limit reached")) {
      // Redirect to home page with upgrade prompt
      redirect(`/app-limit-reached`);
    }
    
    // For other errors, re-throw
    throw error;
  }
}