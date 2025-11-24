# Taskflow

A modern, full-stack task management application built with Next.js, featuring authentication, CRUD operations, and intuitive task organization. This portfolio project extends beyond The Odin Project's Todo List, providing a seamless experience for managing tasks and organizing them into groups with a clean and intuitive user interface.

**Live Demo**: [Taskflow](https://gideonadeti-taskflow.vercel.app/)

## Table of Contents

- [Taskflow](#taskflow)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Task Management](#task-management)
    - [Organization \& Productivity](#organization--productivity)
    - [User Experience](#user-experience)
    - [Security \& Infrastructure](#security--infrastructure)
  - [Screenshots](#screenshots)
    - [Desktop (MacBook Air)](#desktop-macbook-air)
    - [Tablet (iPad Pro 11")](#tablet-ipad-pro-11)
    - [Mobile (iPhone 13 Pro)](#mobile-iphone-13-pro)
  - [Technologies Used](#technologies-used)
    - [Core Framework](#core-framework)
    - [UI \& Styling](#ui--styling)
    - [Data \& State Management](#data--state-management)
    - [Forms \& Validation](#forms--validation)
    - [Utilities \& Enhancements](#utilities--enhancements)
    - [Authentication \& Security](#authentication--security)
    - [Hosting \& Deployment](#hosting--deployment)
  - [Project History](#project-history)
  - [Running Locally](#running-locally)
    - [Prerequisites](#prerequisites)
    - [Setup Steps](#setup-steps)
    - [Getting Environment Variables](#getting-environment-variables)
      - [Database URLs (PostgreSQL)](#database-urls-postgresql)
      - [Clerk Keys](#clerk-keys)
    - [Seeding the Database](#seeding-the-database)
  - [Contributing](#contributing)
  - [Support](#support)
  - [Future Improvements](#future-improvements)
  - [Acknowledgments](#acknowledgments)

## Features

### Task Management

- **Full CRUD Operations**: Create, read, update, and delete tasks and groups
- **Priority System**: Assign and filter tasks by priority levels (low, medium, high)
- **Due Date Tracking**: Set due dates with smart relative time formatting
- **Completion Tracking**: Toggle task completion status with visual indicators
- **Task Details**: View and edit task details in a dedicated dialog

### Organization & Productivity

- **Group Organization**: Organize tasks into custom groups for better structure
- **Dashboard Overview**: Visual progress tracking with completion statistics
- **Advanced Search**: Search tasks by title or description
- **Smart Filtering**: Filter tasks by priority, completion status, and group
- **Bulk Operations**: Efficiently manage multiple tasks at once:
  - Bulk mark complete/incomplete
  - Bulk update priority levels
  - Bulk move between groups
  - Bulk delete

### User Experience

- **Keyboard Shortcuts**: Power user features for faster navigation:
  - `Ctrl/Cmd + B` - Toggle sidebar
  - `Ctrl/Cmd + Alt/Option + T` - Add new task
  - `Ctrl/Cmd + Alt/Option + C` - Toggle selected tasks
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices
- **Dark Mode**: Built-in theme switching with system preference detection
- **Beautiful UI**: Modern, clean interface with smooth animations

### Security & Infrastructure

- **Secure Authentication**: Powered by Clerk for secure user authentication
- **User Isolation**: Each user's data is completely isolated and secure

## Screenshots

### Desktop (MacBook Air)

![Hero section of the landing page on desktop](public/images/screenshots/Macbook-Air-gideonadeti-taskflow.vercel.app.png)
![Overdue tasks view on desktop](public/images/screenshots/Macbook-Air-gideonadeti-taskflow.vercel.app%20(10).png)
![This week overview on desktop](public/images/screenshots/Macbook-Air-gideonadeti-taskflow.vercel.app%20(12).png)

### Tablet (iPad Pro 11")

![Features section of the landing page on tablet](public/images/screenshots/iPad-PRO-11-gideonadeti-taskflow.vercel.app%20(2).png)
![Dashboard view on tablet](public/images/screenshots/iPad-PRO-11-gideonadeti-taskflow.vercel.app%20(7).png)
![Completed tasks page on tablet](public/images/screenshots/iPad-PRO-11-gideonadeti-taskflow.vercel.app%20(9).png)

### Mobile (iPhone 13 Pro)

![Footer section of the landing page on mobile](public/images/screenshots/iPhone-13-PRO-gideonadeti-taskflow.vercel.app%20(4).png)
![Empty inbox state on mobile](public/images/screenshots/iPhone-13-PRO-gideonadeti-taskflow.vercel.app%20(14).png)

## Technologies Used

### Core Framework

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router for full-stack development
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better developer experience

### UI & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library built on Radix UI
- **[Motion](https://motion.dev/)** - Production-ready motion library for React (formerly Framer Motion)

### Data & State Management

- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM for database access
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization for React
- **[TanStack Table](https://tanstack.com/table)** - Headless UI for building tables

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Utilities & Enhancements

- **[date-fns](https://date-fns.org/)** - Modern JavaScript date utility library
- **[cmdk](https://cmdk.paco.me/)** - Command menu component
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notification library
- **[Vercel Analytics](https://vercel.com/analytics)** - Web analytics and performance monitoring

### Authentication & Security

- **[Clerk](https://clerk.com/)** - Complete authentication and user management solution

### Hosting & Deployment

- **[Vercel](https://vercel.com/)** - Platform for frontend deployment

## Project History

This project has evolved through multiple iterations, demonstrating continuous improvement and learning:

- **v1** - Initial vanilla JavaScript implementation
  - [GitHub](https://github.com/Gideon-D-Adeti/todo-list) | [Live Demo](https://gideon-d-adeti.github.io/todo-list/)

- **v2** - Enhanced version with improved structure
  - [GitHub](https://github.com/GDA0/to-do-list) | [Live Demo](https://gda0.github.io/to-do-list/)

- **v3** - Full-stack Next.js application with authentication
  - [GitHub](https://github.com/gideonadeti/taskflow/tree/main) | [Live Demo](https://gideonadeti-task-manager.vercel.app/)

- **v4** - Current revamping of v3 with enhanced features and improved UX
  - [GitHub](https://github.com/gideonadeti/taskflow/tree/revamping) | [Live Demo](https://gideonadeti-taskflow.vercel.app/)

## Running Locally

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- A package manager: **bun**, **npm**, **yarn**, or **pnpm** (examples use bun)
- **PostgreSQL** database (local or cloud instance like [Supabase](https://supabase.com/), [Neon](https://neon.tech/), [Railway](https://railway.app/), or [Prisma Postgres](https://www.prisma.io/data-platform))
- **Git** ([Download](https://git-scm.com/))
- A **Clerk** account for authentication ([Sign up](https://clerk.com/))

### Setup Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/gideonadeti/taskflow.git
   cd taskflow
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory. You can refer to [`.env.example`](.env.example) as a template for the required environment variables:

   ```env
   # Database
   POSTGRES_PRISMA_URL="postgresql://user:password@host:port/database?schema=public&pgbouncer=true"
   POSTGRES_URL_NON_POOLING="postgresql://user:password@host:port/database?schema=public"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ```

   See [Getting Environment Variables](#getting-environment-variables) below for detailed instructions on obtaining these values.

4. **Set Up the Database**

   ```bash
   # Run database migrations (automatically generates Prisma Client)
   bunx prisma migrate dev

   # (Optional) Open Prisma Studio to view/edit database
   bunx prisma studio
   ```

5. **Start the Development Server**

   ```bash
   bun run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Getting Environment Variables

#### Database URLs (PostgreSQL)

1. Create a PostgreSQL database (local or cloud)
2. **For Local Development**: Both URLs can be the same direct connection string
3. Format: `postgresql://username:password@host:port/database?schema=public`

   **Note**: For production/Vercel deployments, use connection pooling URL for `POSTGRES_PRISMA_URL` and direct URL for `POSTGRES_URL_NON_POOLING`.

#### Clerk Keys

1. Sign up at [Clerk](https://clerk.com/)
2. Create a new application
3. Go to **API Keys** in your Clerk dashboard
4. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)

### Seeding the Database

To populate the database with sample data for development:

```bash
bun run seed
```

This will create sample groups and tasks. You can optionally set the `SEED_USER_ID` environment variable to use a specific user ID for seeded data.

**Note**: The seed script will create data for the user ID specified in `SEED_USER_ID` (defaults to "seed-user-123" if not set). Make sure you're authenticated with the corresponding user when viewing seeded data.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to:

1. Fork the project

2. Create your feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)

4. Push to the branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request

Please ensure your code follows the existing style.

## Support

If you find this project helpful or interesting, consider supporting me:

[☕ Buy me a coffee](https://buymeacoffee.com/gideonadeti)

## Future Improvements

This project is continuously evolving, and I plan to keep improving it with new features and enhancements. Some planned additions include:

- **Notifications**: Real-time notifications for task reminders, due dates, and important updates
- More features coming soon...

## Acknowledgments

The original version of this project was built as part of my web development learning journey using [The Odin Project](https://www.theodinproject.com) curriculum. Special thanks to them for providing the [Todo List project lesson](https://www.theodinproject.com/lessons/node-path-javascript-todo-list) and comprehensive curriculum.
