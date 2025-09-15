# Troubleshooting "Unsupported provider" Error

## Problem
You're seeing the error: `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}`

## Cause
This error occurs when you try to authenticate using a provider (like GitHub or Google) that hasn't been enabled in your Supabase project.

## Solution

### Step 1: Check Your Supabase Dashboard
1. Log in to your Supabase account at https://supabase.com
2. Select your project
3. Navigate to **Authentication > Providers** in the left sidebar

### Step 2: Enable Required Providers
You'll see a list of authentication providers. For each provider you want to use:

1. Toggle the **Enable provider** switch to ON
2. For OAuth providers (GitHub, Google, etc.):
   - Enter the required credentials (Client ID and Secret)
   - Save the configuration

### Step 3: GitHub Provider Setup
If you want to use GitHub authentication:

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: AUN.AI
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: https://[your-project-ref].supabase.co/auth/v1/callback
4. Click "Register application"
5. Copy the Client ID and generate a new Client Secret
6. Back in Supabase, enable GitHub provider and paste the credentials

### Step 4: Google Provider Setup
If you want to use Google authentication:

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to APIs & Services > Credentials
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add this authorized redirect URI:
   - https://[your-project-ref].supabase.co/auth/v1/callback
7. Copy the Client ID and Client Secret
8. Back in Supabase, enable Google provider and paste the credentials

### Step 5: Email Provider Setup
For email/password authentication:

1. In Supabase, go to Authentication > Providers
2. Find "Email" in the list
3. Toggle "Enable provider" to ON
4. Optionally configure email templates

### Step 6: Verify Redirect URLs
In Supabase, go to Authentication > URL Configuration and ensure you have these URLs:
- http://localhost:3000/**
- https://your-production-domain.com/** (if you have a production domain)

### Step 7: Test Again
After enabling providers:
1. Save all changes in Supabase
2. Restart your development server: `npm run dev`
3. Try signing in again

## Alternative Solution
If you don't want to set up OAuth providers right now, you can:

1. Use the Email authentication option we added
2. Temporarily modify the code to only show email sign-in until you configure OAuth providers

## Need More Help?
- Supabase Authentication Documentation: https://supabase.com/docs/guides/auth
- GitHub OAuth Setup: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
- Google OAuth Setup: https://developers.google.com/identity/protocols/oauth2