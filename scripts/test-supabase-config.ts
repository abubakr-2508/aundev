import { createClient } from '@supabase/supabase-js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function testSupabaseConfig() {
  console.log('Testing Supabase configuration...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase configuration in environment variables');
    console.log('Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file');
    return;
  }
  
  console.log('✓ Environment variables found');
  
  try {
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test the connection by getting the auth settings
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return;
    }
    
    console.log('✓ Supabase client created successfully');
    console.log('✓ Connection to Supabase established');
    
    // Get the enabled providers
    console.log('\nChecking enabled providers...');
    console.log('Note: This test only verifies connection. To see enabled providers, check your Supabase dashboard.');
    
    console.log('\n✅ Supabase configuration test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure you have enabled providers in your Supabase dashboard');
    console.log('2. Run the development server: npm run dev');
    console.log('3. Visit http://localhost:3000 and try signing in');
    
  } catch (error) {
    console.error('❌ Error testing Supabase configuration:', error);
  }
}

testSupabaseConfig();