# Supabase Auth Setup Instructions

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new Supabase project

## Configuration Steps

### 1. Get Supabase Credentials
1. Go to your Supabase project dashboard
2. Navigate to Project Settings > API
3. Copy the following values:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Project API Key (anon key) (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 2. Update Environment Variables
Update your `.env` file with the Supabase credentials:

```env
# Supabase Auth Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Configure Authentication Providers
In your Supabase dashboard, go to Authentication > Providers and enable the providers you want to support:

#### GitHub Authentication
1. In your GitHub account, go to Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: AUN.AI
   - Homepage URL: http://localhost:3000 (or your production URL)
   - Authorization callback URL: https://[your-supabase-project-ref].supabase.co/auth/v1/callback
4. Click "Register application"
5. Copy the Client ID and Client Secret
6. Back in Supabase, go to Authentication > Providers > GitHub
7. Toggle "Enable provider" to ON
8. Paste the Client ID and Client Secret
9. Save the configuration

#### Google Authentication
1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Navigate to APIs & Services > Credentials
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add the following to "Authorized redirect URIs":
   - https://[your-supabase-project-ref].supabase.co/auth/v1/callback
7. Click "Create"
8. Copy the Client ID and Client Secret
9. Back in Supabase, go to Authentication > Providers > Google
10. Toggle "Enable provider" to ON
11. Paste the Client ID and Client Secret
12. Save the configuration

#### Email Authentication
1. In Supabase, go to Authentication > Providers > Email
2. Toggle "Enable provider" to ON
3. Configure email templates as needed
4. Save the configuration

### 4. Set up Redirect URLs
1. In Authentication > URL Configuration, add your redirect URLs:
   - http://localhost:3000/**
   - https://your-production-domain.com/**

### 5. Test the Setup
1. Start your development server: `npm run dev`
2. Visit http://localhost:3000
3. Try signing in with one of your configured providers

## Database Setup
The migration has already been applied to create the `user_freestyle_data` table. If you need to recreate it:

```bash
npx drizzle-kit push
```

## Troubleshooting

### Common Issues
1. **"Missing environment variables"**: Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file
2. **"Failed to connect to Supabase"**: Verify your project URL and API key are correct
3. **"Authentication failed"**: Check that you've enabled the authentication providers in your Supabase dashboard
4. **"Unsupported provider: provider is not enabled"**: This specific error means the provider you're trying to use (GitHub, Google, etc.) is not enabled in your Supabase dashboard. Follow the provider setup instructions above.

### Need Help?
- Supabase Documentation: https://supabase.com/docs
- Supabase Auth Guide: https://supabase.com/docs/guides/auth