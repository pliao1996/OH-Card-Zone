# OH Cards Digital Application

## Overview

This is a digital OH Cards (projective card) application built for self-exploration and introspection. The app allows users to browse a collection of 88 image cards and 100 word cards, and draw cards in various modes (single image, single word, or classic pair combination). The interface features a mystical, soft aesthetic with card flip animations and a Chinese language UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom mystical theme (warm off-whites, muted purples, terracotta accents)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for card flip animations and page transitions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Pattern**: RESTful API with typed route contracts
- **Development**: Hot module replacement via Vite middleware in dev mode
- **Production**: Static file serving from built assets

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains table definitions
- **Migrations**: Managed via `drizzle-kit push` command
- **Connection**: pg Pool with DATABASE_URL environment variable

### API Design
- **Contract**: Shared route definitions in `shared/routes.ts` using Zod schemas
- **Endpoints**:
  - `GET /api/cards` - List all cards (optional type filter)
  - `GET /api/cards/:id` - Get single card
  - `POST /api/draw` - Draw random cards by mode (image/word/pair)

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including shadcn/ui
    pages/        # Route pages (Home, Gallery, Spreads)
    hooks/        # Custom hooks for data fetching
    lib/          # Utilities and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Drizzle connection setup
shared/           # Shared between client/server
  schema.ts       # Drizzle table definitions
  routes.ts       # API contract with Zod schemas
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database via DATABASE_URL environment variable
- **connect-pg-simple**: Session storage (available but may not be actively used)

### Key NPM Packages
- **drizzle-orm** + **drizzle-zod**: Database ORM and schema validation
- **@tanstack/react-query**: Async state management
- **framer-motion**: Animation library
- **zod**: Runtime type validation for API contracts
- **Radix UI**: Accessible component primitives (accordion, dialog, tabs, etc.)

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Production server bundling
- **Vite**: Frontend build and dev server
- **@replit/vite-plugin-***: Replit-specific development enhancements