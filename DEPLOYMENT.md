# Deployment Guide

This guide covers deploying SnapSplit to Vercel with all necessary integrations.

## 🚀 Quick Deploy

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/snapsplit)

### Manual Deployment

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project settings

3. **Set Environment Variables**
   In your Vercel dashboard, add these environment variables:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   BLOB_READ_WRITE_TOKEN=your_blob_token
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   \`\`\`

## 🔧 Required Integrations

### Supabase Setup
1. Create a new Supabase project
2. Run the database migrations (see `scripts/` folder)
3. Configure authentication providers
4. Set up Row Level Security policies

### Vercel Blob Setup
1. Enable Vercel Blob in your project settings
2. Copy the read/write token to environment variables

## 🔒 Security Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase RLS policies are enabled
- [ ] Authentication is properly configured
- [ ] File upload limits are set
- [ ] CORS is configured for your domain

## 📊 Performance Optimization

- Images are automatically optimized by Next.js
- Face detection runs client-side to reduce server load
- Database queries are optimized with proper indexing
- Static assets are served from Vercel's CDN

## 🔍 Monitoring

- Use Vercel Analytics for performance monitoring
- Set up Supabase monitoring for database health
- Configure error tracking with Sentry (optional)

## 🚨 Troubleshooting

### Common Issues

1. **Face detection not working**
   - Check if TensorFlow.js models are loading
   - Verify HTTPS is enabled (required for camera access)

2. **File uploads failing**
   - Check Blob storage configuration
   - Verify file size limits

3. **Authentication issues**
   - Confirm Supabase URL and keys
   - Check redirect URLs in Supabase auth settings

### Support

For deployment issues, check:
- Vercel deployment logs
- Supabase logs
- Browser console for client-side errors
