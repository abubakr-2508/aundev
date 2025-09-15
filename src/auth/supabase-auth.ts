import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { freestyle } from "@/lib/freestyle";

// Create a Supabase server client
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.then(cookies => cookies.get(name)?.value);
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.then(cookies => cookies.set({ name, value, ...options }));
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.then(cookies => cookies.set({ name, value: "", ...options }));
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Get the current user
export async function getUser() {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("User not found");
  }

  // Check if user has freestyle identity, create one if not
  // Note: We'll need to store this in a separate table since Supabase doesn't have server metadata like Stack Auth
  const { data: userData, error: userError } = await supabase
    .from('user_freestyle_data')
    .select('freestyle_identity')
    .eq('user_id', user.id)
    .single();

  let freestyleIdentity: string;
  
  if (userError || !userData) {
    // Create freestyle identity for the user
    const gitIdentity = await freestyle.createGitIdentity();
    freestyleIdentity = gitIdentity.id;
    
    // Store in our database
    const { error: insertError } = await supabase
      .from('user_freestyle_data')
      .insert({
        user_id: user.id,
        freestyle_identity: freestyleIdentity
      });
    
    if (insertError) {
      console.error("Error storing freestyle identity:", insertError);
    }
  } else {
    freestyleIdentity = userData.freestyle_identity;
  }

  return {
    userId: user.id,
    freestyleIdentity: freestyleIdentity,
  };
}