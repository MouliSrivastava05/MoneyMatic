# Render Deployment Guide for MoneyMatic Backend

## Prerequisites
- ✅ GitHub repository with your code
- ✅ Render account (sign up at https://render.com)
- ✅ Aiven database credentials (or local database for testing)

## Step-by-Step Deployment

### Step 1: Push Code to GitHub
Make sure your code is committed and pushed:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended for easy repo connection)
3. Authorize Render to access your GitHub repositories

### Step 3: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if prompted
4. Select your GitHub repository: `MoneyMatic`
5. Click **"Connect"**

### Step 4: Configure Service Settings

**Basic Settings:**
- **Name**: `moneymatic-backend` (or your choice)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `server` ⚠️ **IMPORTANT**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run prisma:generate`
- **Start Command**: `npm start`

### Step 5: Add Environment Variables

Click **"Add Environment Variable"** and add these:

#### Required Variables:
1. **DATABASE_URL**
   ```
   mysql://avnadmin:YOUR_PASSWORD@mysql-3a0e7b01-moulicode5-4c6d.f.aivencloud.com:26676/defaultdb?sslmode=require
   ```
   Replace `YOUR_PASSWORD` with your actual Aiven password

2. **JWT_SECRET**
   ```
   your-very-strong-random-secret-key-here
   ```
   Generate one using: `npm run generate:jwt-secret` (locally)

3. **NODE_ENV**
   ```
   production
   ```

#### Optional Variables:
- **PORT**: Render sets this automatically (don't set manually)

### Step 6: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying
3. Wait 5-10 minutes for first deployment
4. Watch the build logs for any errors

### Step 7: Verify Deployment

Once deployed:
1. Click on your service name
2. Copy the **URL** (e.g., `https://moneymatic-backend.onrender.com`)
3. Test the endpoint:
   ```
   https://your-service-url.onrender.com/
   ```
   Should return: "Welcome to MoneyMatic Server"

## Environment Variables Setup in Render

### Quick Copy-Paste Format:

```
DATABASE_URL=mysql://avnadmin:YOUR_PASSWORD@mysql-3a0e7b01-moulicode5-4c6d.f.aivencloud.com:26676/defaultdb?sslmode=require

JWT_SECRET=your-generated-secret-key-here

NODE_ENV=production
```

## Important Notes

### Build Command
The build command `npm install && npm run prisma:generate` is crucial because:
- `npm install` installs all dependencies including Prisma
- `npm run prisma:generate` generates Prisma Client (required before server starts)

### Root Directory
⚠️ **Must be set to `server`** - This tells Render where your Node.js app is located

### Port
- Render automatically sets `PORT` environment variable
- Your code uses `process.env.PORT || 5000` which works correctly

### Database Connection
- Make sure your Aiven database is accessible from Render's IPs
- Aiven free tier should work fine
- If connection fails, check Aiven IP allowlist settings

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure `Root Directory` is set to `server`
- Verify `package.json` exists in `server/` directory

### Deployment Fails
- Check deployment logs
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct

### Database Connection Fails
- Verify `DATABASE_URL` in Render matches your Aiven credentials
- Check Aiven service is running
- Ensure Aiven IP allowlist allows Render's IPs (or is "Open to all")

### Prisma Client Not Found
- Build command should include `npm run prisma:generate`
- Check build logs to ensure Prisma Client was generated

## Testing After Deployment

1. **Test root endpoint:**
   ```
   GET https://your-service-url.onrender.com/
   ```

2. **Test signup endpoint:**
   ```
   POST https://your-service-url.onrender.com/api/auth/signup
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "test123456"
   }
   ```

3. **Test login endpoint:**
   ```
   POST https://your-service-url.onrender.com/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "test123456"
   }
   ```

## Updating Your Frontend

After deployment, update your frontend `.env` or Vercel environment variables:
```
REACT_APP_API_URL=https://your-service-url.onrender.com
```

## Render Dashboard Links

- **Dashboard**: https://dashboard.render.com
- **Service Logs**: Click on your service → "Logs" tab
- **Service Metrics**: Click on your service → "Metrics" tab
- **Environment Variables**: Click on your service → "Environment" tab

## Cost

- Render free tier includes:
  - 750 hours/month (enough for 24/7 operation)
  - Automatic SSL
  - Custom domains
  - **Note**: Services sleep after 15 minutes of inactivity (free tier)

