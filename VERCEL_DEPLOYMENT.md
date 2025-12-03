# Vercel Deployment Guide for Schola

## Quick Setup Steps

### 1. Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `Patel5600/Schola`
4. **IMPORTANT**: Set the **Root Directory** to `frontend`

### 2. Configure Build Settings
Vercel should auto-detect Next.js, but verify:
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (runs in frontend directory)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (runs in frontend directory)

### 3. Set Environment Variables
In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
NEXT_PUBLIC_WS_URL=https://your-backend-api-url.com
NEXT_PUBLIC_APP_NAME=Schola
```

**Note**: Replace `your-backend-api-url.com` with your actual backend API URL.

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Troubleshooting

### Issue: Build Fails
- Check that Root Directory is set to `frontend`
- Verify all dependencies are in `frontend/package.json`
- Check build logs in Vercel dashboard

### Issue: 404 Errors
- Ensure Root Directory is set correctly
- Check that `vercel.json` is in the repository root
- Verify environment variables are set

### Issue: API Calls Fail
- Set `NEXT_PUBLIC_API_URL` environment variable
- Ensure your backend API is accessible
- Check CORS settings on backend

### Issue: Site Shows Blank Page
- Check browser console for errors
- Verify all environment variables are set
- Check Vercel function logs

## Manual Configuration in Vercel Dashboard

If automatic detection doesn't work:

1. Go to **Settings** → **General**
2. Under **Root Directory**, click **Edit**
3. Select `frontend` folder
4. Save changes
5. Redeploy

## Environment Variables Required

Make sure these are set in Vercel:
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL (usually same as API without /api)
- `NEXT_PUBLIC_APP_NAME` - Application name (optional)

## After Deployment

1. Your site will be available at: `https://schola-drab.vercel.app`
2. Update your backend CORS settings to allow your Vercel domain
3. Test the application thoroughly

## Need Help?

Check Vercel deployment logs in the dashboard for specific error messages.

