# Schola – Department Community Portal

A complete, production-ready full-stack web application for department communication and administration. Built with Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui for the frontend, and Node.js + Express + TypeScript + PostgreSQL (via Prisma) for the backend.

## Features

### Role-Based Authentication
- **Student**: Access to read-only resources, view announcements, notes, events, and participate in skill exchange
- **Teacher**: Can create notes, announcements, and events; manage attendance
- **HOD**: Department oversight, content moderation, user management
- **Admin**: Full platform authority, system-wide management

### Core Modules
- **Authentication**: JWT-based auth with refresh tokens, email verification, password reset
- **Announcements**: Create, read, update, delete announcements with role-based targeting and pinning
- **Notes**: Upload and manage study materials with subject/semester filtering
- **Events**: Event management with registration, attendance tracking, and capacity limits
- **Skill Exchange**: Community-driven skill sharing (offers and requests)
- **Profile**: User profile management

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** components
- **React Hook Form** + **Zod** for form validation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **next-themes** for dark mode

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** via **Prisma ORM**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for validation
- **Winston** for logging
- **Express Rate Limit** for API protection

## Project Structure

```
schola/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment and database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, error handling, rate limiting, role guards
│   │   ├── models/          # Prisma schema (in prisma/schema.prisma)
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helpers (JWT, email, upload, logger)
│   │   └── index.ts         # Server bootstrap
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/          # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/     # Dashboard route group
│   │   │   ├── dashboard/
│   │   │   ├── announcements/
│   │   │   ├── notes/
│   │   │   ├── events/
│   │   │   ├── skills/
│   │   │   ├── profile/
│   │   │   └── layout.tsx   # Dashboard layout with sidebar
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/           # Header, Sidebar
│   │   ├── AnnouncementCard.tsx
│   │   ├── NoteCard.tsx
│   │   ├── EventCard.tsx
│   │   └── SkillCard.tsx
│   ├── lib/
│   │   ├── api.ts           # Centralized API client
│   │   ├── auth.tsx          # Auth context
│   │   └── utils.ts         # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example             # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ (or use Supabase/other Postgres provider)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd schola
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env` in the root directory and fill in your values:
   ```bash
   cp .env.example .env
   ```
   
   Update the following in `.env`:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A random string (minimum 32 characters)
   - `JWT_REFRESH_SECRET`: Another random string (minimum 32 characters)
   - `FRONTEND_URL`: Frontend URL (default: http://localhost:3000)
   - `RESEND_API_KEY`: (Optional) For email verification
   - `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`: (Optional) For file uploads

   Create `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Start the development servers**

   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## Development

### Backend Commands
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npx prisma studio    # Open Prisma Studio (database GUI)
```

### Frontend Commands
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email?token=...` - Verify email

### Announcements
- `GET /api/announcements` - Get all announcements (with filters)
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement (teacher/hod/admin)
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Upload note (teacher/hod/admin)
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (teacher/hod/admin)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/attendance` - Mark attendance (teacher/hod/admin)

### Skills
- `GET /api/skills` - Get all skills (with filters)
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create skill offer/request
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

## Database Schema

The Prisma schema includes:
- **User**: Authentication and user profiles
- **Department**: Department information
- **Announcement**: Department announcements
- **Note**: Study materials and notes
- **Event**: Department events
- **EventRegistration**: Event registrations and attendance
- **SkillExchange**: Skill offers and requests
- **Enrollment**: Student enrollments

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting on auth endpoints
- Input validation with Zod
- CORS configuration
- Helmet.js for security headers

## Testing

### Backend Tests
```bash
cd backend
npm test
```

Tests are located in `backend/src/services/__tests__/`:
- `authService.test.ts` - Authentication service tests
- `announcementService.test.ts` - Announcement service tests

### Frontend Tests
Frontend component tests can be added using Jest and React Testing Library.

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Build: `npm run build`
3. Run migrations: `npx prisma migrate deploy`
4. Start: `npm start`

### Frontend
1. Set `NEXT_PUBLIC_API_URL` to your production API URL
2. Build: `npm run build`
3. Start: `npm start`

## Future Enhancements

The codebase is structured to easily extend with:
- **Analytics**: User activity tracking, engagement metrics
- **Real-time Notifications**: WebSocket integration for live updates
- **Chat**: Direct messaging between users
- **File Upload**: Cloudinary integration for note uploads
- **Email Service**: Resend integration for email verification
- **Advanced Search**: Full-text search for announcements, notes
- **Calendar Integration**: Sync events with external calendars
- **Mobile App**: React Native mobile application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
