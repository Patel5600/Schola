# Schola Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and other configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=schola
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. Create the PostgreSQL database:
   ```bash
   createdb schola
   ```

6. Run database migrations:
   ```bash
   npm run migrate
   ```

7. Create logs directory:
   ```bash
   mkdir -p logs
   ```

8. Create uploads directory:
   ```bash
   mkdir -p uploads/notes
   ```

9. Start the backend server:
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_WS_URL=http://localhost:5000
   NEXT_PUBLIC_APP_NAME=Schola
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Creating the First Admin User

After setting up the database, you can create an admin user directly in PostgreSQL:

```sql
INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified, is_active)
VALUES (
  'admin@schola.edu',
  '$2a$12$YourHashedPasswordHere', -- Use bcrypt to hash your password
  'Admin',
  'User',
  'admin',
  true,
  true
);
```

Or use the registration endpoint and verify manually in the database.

## Features Overview

### Admin Dashboard
- Full platform management
- User account creation and role assignment
- System moderation
- Analytics monitoring
- Security audit logs

### HOD Dashboard
- Faculty oversight
- Departmental notices approval
- Schedule and event management
- Resource validation

### Teacher Dashboard
- Upload subject notes
- Create announcements
- Manage attendance
- Conduct surveys
- Event registration

### Student Dashboard
- Access learning materials
- View announcements
- Participate in events
- Skill Exchange Network
- Academic portfolio
- Peer discussions

## Security Features

- Rate-limited login attempts
- JWT authentication
- Password encryption (bcrypt)
- Session monitoring
- Audit logs
- Input validation
- Secure file uploads

## Performance Features

- Server-side caching
- Database indexing
- PWA offline support
- Dark mode preferences
- Optimized asset delivery

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if the database exists

### Port Already in Use
- Change the PORT in `.env` (backend)
- Change the port in Next.js config (frontend)

### Email Not Sending
- Verify email credentials in `.env`
- For Gmail, use an App Password instead of regular password
- Check email service logs

## Development Notes

- Backend uses TypeScript with Express
- Frontend uses Next.js 14 with React
- Real-time features use Socket.io
- Database uses PostgreSQL
- Styling uses Tailwind CSS with custom glassmorphism effects

