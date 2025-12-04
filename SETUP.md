# Setup Guide for Schola

This guide will help you set up the Schola application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/) or use [Supabase](https://supabase.com/) (free tier available)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

## Step-by-Step Setup

### 1. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE schola;
   ```
3. Note your connection details (host, port, username, password)

#### Option B: Supabase (Recommended for quick setup)
1. Go to [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (it will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```bash
   # Copy the example file (if it exists) or create manually
   cp .env.example .env
   ```

4. Edit `.env` and fill in your values:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/schola
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-minimum-32-characters-long-change-this
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ```

   **Important**: 
   - Replace `DATABASE_URL` with your actual PostgreSQL connection string
   - Generate secure random strings for `JWT_SECRET` and `JWT_REFRESH_SECRET` (you can use: `openssl rand -base64 32`)

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

7. (Optional) Open Prisma Studio to view your database:
   ```bash
   npx prisma studio
   ```

8. Create logs directory (for Winston logger):
   ```bash
   mkdir logs
   ```

9. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend should now be running on `http://localhost:5000`

10. Test the health endpoint:
    Open your browser and go to: `http://localhost:5000/health`
    You should see: `{"status":"ok","timestamp":"...","database":"connected"}`

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend should now be running on `http://localhost:3000`

### 4. Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the login page
3. Create a new account by clicking "Register"
4. After registration, you'll be redirected to login
5. Log in with your credentials
6. You should see the dashboard

## Troubleshooting

### Backend Issues

**Database Connection Error**
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check if the database exists
- Verify username and password are correct

**Port Already in Use**
- Change the `PORT` in `.env` to a different port (e.g., 5001)
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local` accordingly

**Prisma Migration Errors**
- Make sure the database exists
- Check your connection string
- Try resetting: `npx prisma migrate reset` (⚠️ This will delete all data)

### Frontend Issues

**API Connection Error**
- Verify `NEXT_PUBLIC_API_URL` matches your backend URL
- Ensure the backend is running
- Check CORS settings in backend

**Build Errors**
- Delete `node_modules` and `.next` folder, then reinstall:
  ```bash
  rm -rf node_modules .next
  npm install
  ```

### Common Issues

**Module Not Found**
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**TypeScript Errors**
- Run: `npm run build` to see detailed errors
- Ensure all dependencies are installed

## Next Steps

1. **Create your first user**: Register through the UI
2. **Set up email service** (optional): Add `RESEND_API_KEY` to backend `.env` for email verification
3. **Set up file upload** (optional): Add Cloudinary credentials to backend `.env` for note uploads
4. **Explore the features**: 
   - Create announcements (as teacher/hod/admin)
   - Upload notes (as teacher/hod/admin)
   - Create events and register for them
   - Post skill offers/requests

## Development Tips

- Use Prisma Studio to view and edit database records: `npx prisma studio`
- Check backend logs in the `logs/` directory
- Use browser DevTools to debug frontend issues
- Check Network tab for API call debugging

## Production Deployment

See the main `README.md` for production deployment instructions.
