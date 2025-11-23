# Taskflow

A modern, full-stack task management application built with Next.js, featuring authentication, CRUD operations, and intuitive task organization. Built as a portfolio project extending beyond The Odin Project's Todo List, Taskflow provides a seamless experience for managing tasks and organizing them into groups, with a clean and intuitive user interface.

**Live Demo**: [Taskflow](https://gideonadeti-task-manager.vercel.app/)

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

### Database Setup

### Initial Migration

The first time you set up the database, run:

```bash
bunx prisma migrate dev --name init
```

This will:

- Create the database schema
- Generate Prisma Client
- Apply all migrations

### Seeding the Database

To populate the database with sample data for development:

```bash
bun run seed
```

This will create sample groups and tasks. You can optionally set the `SEED_USER_ID` environment variable to use a specific user ID for seeded data.

**Note**: The seed script will create data for the user ID specified in `SEED_USER_ID` (defaults to "seed-user-123" if not set). Make sure you're authenticated with the corresponding user when viewing seeded data.

### Useful Prisma Commands

```bash
# Generate Prisma Client after schema changes
bunx prisma generate

# Create a new migration
bunx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data)
bunx prisma migrate reset

# View database in Prisma Studio
bunx prisma studio

# Format Prisma schema
bunx prisma format

# Validate Prisma schema
bunx prisma validate
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server with Turbopack |
| `bun run build` | Build application for production |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint to check code quality |
| `bun run seed` | Seed the database with sample data |

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a new branch** for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Development Workflow

1. **Make your changes** following the project's code style
2. **Run linting** to check code quality:

   ```bash
   bun run lint
   ```

3. **Test your changes** locally in development mode

### Submitting Changes

1. **Commit your changes** with clear, descriptive messages:

   ```bash
   git commit -m "Add feature: description of your change"
   ```

2. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub:
   - Provide a clear description of your changes
   - Reference any related issues
   - Include screenshots if applicable
   - Ensure linting is clean

### Code Style Guidelines

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Follow existing code style and formatting
- **Naming**: Use descriptive names for variables, functions, and components
- **Comments**: Add comments for complex logic
- **Documentation**: Update documentation for API or behavior changes

### Commit Message Format

Use clear, descriptive commit messages:

```text
type: short description

Longer explanation if needed
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`

### Reporting Issues

When reporting issues, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Node.js version, OS, browser (if applicable)
- **Screenshots**: If applicable

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables in Production

Ensure all environment variables from the [Running Locally](#running-locally) section are set in your production environment.

### Database Migrations in Production

Run migrations on your production database:

```bash
bunx prisma migrate deploy
```

**⚠️ Warning**: Always test migrations in a staging environment first!

## Documentation

- **[API Documentation](docs/API.md)**: Complete API reference with request/response examples

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built as a portfolio project extending The Odin Project's Todo List
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/gideonadeti/taskflow/issues)
- **Pull Requests**: [GitHub Pull Requests](https://github.com/gideonadeti/taskflow/pulls)

---

Made with ❤️ by [Gideon Adeti](https://github.com/gideonadeti)
