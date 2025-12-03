# Schola - Next-Generation Academic Platform

Schola is a comprehensive academic web platform designed to digitally transform departmental communication and administration. It unifies all academic interactions into a single intelligent ecosystem with a modern, animated SaaS design.

## Features

### Role-Based Access Control
- **Admin**: Full platform authority, account management, system moderation, analytics, security audit
- **HOD**: Faculty oversight, departmental notices, schedules, events, resource validation
- **Teachers**: Upload notes, create announcements, conduct surveys, manage attendance, distribute materials
- **Students**: Access learning materials, view announcements, participate in events, skill exchange network

### Core Modules
- Secure authentication with OTP verification
- Centralized announcement broadcasting with expiry controls
- Tagged notes library with PDF preview and download tracking
- Integrated event management with QR code attendance and certificates
- Real-time notifications (WebSocket + PWA push alerts)
- Peer discussion boards
- Skill Exchange Network
- Learning activity tracking

### Security & Performance
- Rate-limited login attempts
- CAPTCHA enforcement
- Encrypted password hashing
- Session monitoring
- Audit logs
- Server-side caching
- CDN-based asset delivery
- PWA offline support
- Dark mode preferences

## Tech Stack

### Frontend
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Socket.io Client (real-time)
- PWA support

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Socket.io (WebSocket)
- Rate limiting
- File upload handling

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables (see `.env.example` files)

4. Run database migrations:
   ```bash
   cd backend && npm run migrate
   ```

5. Start development servers:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

## Project Structure

```
schola/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express backend API
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

## License

MIT

