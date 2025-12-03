# Vercel Deployment Troubleshooting Guide

## Common Errors and Solutions

### 1. **NOT_FOUND (404)**
**Cause**: Root directory not set correctly or routes not matching

**Solution**:
- Go to Vercel Dashboard → Settings → General
- Set **Root Directory** to `frontend`
- Redeploy

### 2. **FUNCTION_INVOCATION_FAILED (500)**
**Cause**: Runtime error in server-side code

**Solution**:
- Check Vercel Function Logs in dashboard
- Look for errors in `app/` directory components
- Ensure all imports are correct
- Check environment variables are set

### 3. **DEPLOYMENT_NOT_FOUND (404)**
**Cause**: Build failed or deployment was deleted

**Solution**:
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct build script
- Verify all dependencies are listed

### 4. **ROUTER_CANNOT_MATCH (502)**
**Cause**: Routing configuration issue

**Solution**:
- Verify `next.config.js` is correct
- Check dynamic routes like `[role]` are properly formatted
- Ensure `not-found.tsx` exists

### 5. **Build Failures**
**Common causes**:
- Missing dependencies
- TypeScript errors
- Missing environment variables
- Incorrect Node.js version

**Solution**:
- Check build logs for specific errors
- Run `npm run build` locally to test
- Ensure Node.js version matches (check `package.json` engines)

## Quick Fixes

### Fix 1: Simplify vercel.json
If Vercel auto-detects Next.js, you might not need `vercel.json` at all. Try removing it and setting Root Directory in dashboard.

### Fix 2: Check Environment Variables
Ensure these are set in Vercel:
```
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_WS_URL=your-ws-url
NEXT_PUBLIC_APP_NAME=Schola
```

### Fix 3: Verify Build Command
In Vercel dashboard, ensure:
- **Build Command**: `npm run build` (runs in frontend directory)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (runs in frontend directory)

### Fix 4: Check Node.js Version
Add to `frontend/package.json`:
```json
"engines": {
  "node": ">=18.0.0"
}
```

## Debugging Steps

1. **Check Build Logs**
   - Go to Vercel Dashboard → Deployments
   - Click on failed deployment
   - Review build logs for errors

2. **Test Locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Check Function Logs**
   - Vercel Dashboard → Functions tab
   - Look for runtime errors

4. **Verify File Structure**
   - Ensure `frontend/app/layout.tsx` exists
   - Ensure `frontend/app/page.tsx` exists
   - Check all imports are correct

## Still Having Issues?

1. Check the specific error code in Vercel dashboard
2. Review the error message details
3. Check Vercel documentation for that specific error
4. Contact Vercel support with error details

