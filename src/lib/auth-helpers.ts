// Utility function to check enabled auth providers
export function getEnabledProviders() {
  // This is a client-side helper that provides information about what providers
  // are typically enabled. In a real application, you would get this information
  // from your Supabase project settings.
  
  return {
    github: {
      enabled: false, // Set to true when GitHub is enabled in Supabase
      name: 'GitHub',
      setupRequired: true,
      setupUrl: 'https://github.com/settings/applications/new'
    },
    google: {
      enabled: false, // Set to true when Google is enabled in Supabase
      name: 'Google',
      setupRequired: true,
      setupUrl: 'https://console.cloud.google.com/apis/credentials'
    },
    email: {
      enabled: true, // Email is usually enabled by default
      name: 'Email',
      setupRequired: false
    }
  };
}

// Helper function to get a user-friendly message about enabling providers
export function getProviderSetupMessage(provider) {
  const providers = getEnabledProviders();
  const providerInfo = providers[provider];
  
  if (!providerInfo) {
    return `Unknown provider: ${provider}`;
  }
  
  if (providerInfo.enabled) {
    return `${providerInfo.name} is enabled and ready to use.`;
  }
  
  if (providerInfo.setupRequired) {
    return `${providerInfo.name} is not enabled. Please set it up at ${providerInfo.setupUrl} and enable it in your Supabase dashboard.`;
  }
  
  return `${providerInfo.name} is not enabled. Please enable it in your Supabase dashboard.`;
}