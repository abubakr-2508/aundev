# Deployment Guide

This guide provides instructions for deploying the AUN.AI application to a production server.

## Prerequisites

1. Node.js 18+ installed
2. PostgreSQL database
3. Redis server
4. Domain name (optional but recommended)

## Environment Variables

Before deploying, make sure to set the following environment variables in your production environment:

```bash
# Core Configuration
FREESTYLE_API_KEY=your_freestyle_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DATABASE_URL=your_database_url_here

# Supabase Auth Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Domain Configuration
PREVIEW_DOMAIN=your_production_domain_here
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com

# Morph API
MORPH_API_KEY=your_morph_api_key_here

# Redis
REDIS_URL=redis://your-redis-host:6379

# Stripe Configuration (if using payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
STRIPE_SECRET_KEY=sk_live_your_live_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id_here
STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id_here
```

## Deployment Steps

### 1. Build the Application

```bash
npm run build
```

### 2. Start the Application

```bash
npm start
```

The application will be available at `http://localhost:3000` by default.

### 3. Production Server Setup

For production deployment, we recommend using a process manager like PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start npm --name "aun-ai" -- start

# Save the PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

### 4. Reverse Proxy Configuration (Nginx)

If using Nginx as a reverse proxy, use the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL Configuration

For SSL, you can use Let's Encrypt with Certbot:

```bash
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Common Issues

1. **"l is not a function" Error**: This is typically caused by minification issues. Ensure that function names are preserved during minification.

2. **Database Connection Issues**: Verify that the DATABASE_URL is correctly set and the database is accessible.

3. **Redis Connection Issues**: Ensure Redis is running and the REDIS_URL is correctly configured.

4. **Authentication Issues**: Verify that all Stack Auth environment variables are correctly set.

### Debugging Steps

1. Check the application logs:
   ```bash
   pm2 logs aun-ai
   ```

2. Verify environment variables:
   ```bash
   printenv | grep NEXT_PUBLIC
   printenv | grep STACK
   ```

3. Test database connectivity:
   ```bash
   # Use a database client to test the connection
   ```

4. Test Redis connectivity:
   ```bash
   redis-cli -u $REDIS_URL ping
   ```

## Scaling Considerations

For high-traffic deployments, consider:

1. Using a load balancer
2. Implementing database connection pooling
3. Using Redis clustering
4. Implementing CDN for static assets
5. Using separate instances for different services

## Monitoring

Set up monitoring for:

1. Application uptime
2. Database performance
3. Redis performance
4. Error rates
5. Response times

Recommended tools:
- PM2 Plus for process monitoring
- New Relic or DataDog for application performance monitoring
- Sentry for error tracking