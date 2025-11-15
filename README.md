# Taskflow

A modern, full-stack task management application built with Next.js, featuring authentication, CRUD operations, and intuitive task organization.

**Live Demo**: [Taskflow](https://gideonadeti-task-manager.vercel.app/)

## Overview

Taskflow is a full-stack application built as a portfolio project, extending beyond The Odin Project's Todo List project to demonstrate advanced web development skills. It provides a seamless experience for managing tasks and organizing them into groups, with a clean and intuitive user interface.

## Features

- **Create, Read, Update, Delete (CRUD) Tasks**: Easily manage your tasks with full CRUD functionality
- **Create, Read, Update, Delete (CRUD) Groups**: Organize your tasks into groups for better organization
- **Task Completion Toggle**: Easily toggle task status as completed or not
- **Priority Levels**: Assign priority levels (low, medium, high) to tasks
- **Due Dates**: Set and manage due dates for tasks
- **User Authentication**: Secure authentication using Clerk
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Built-in theme switching

## Technologies Used

- **Frontend & Backend**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud instance like [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Railway](https://railway.app/))
- **Git** ([Download](https://git-scm.com/))
- A **Clerk** account for authentication ([Sign up](https://clerk.com/))

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
POSTGRES_PRISMA_URL="postgresql://user:password@host:port/database?schema=public&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:port/database?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Node Environment
NODE_ENV="development"
```

### Getting Environment Variables

#### Database URLs (PostgreSQL)

1. Create a PostgreSQL database (local or cloud)
2. **For Vercel/Production**: Use connection pooling URL for `POSTGRES_PRISMA_URL` and direct URL for `POSTGRES_URL_NON_POOLING`
3. **For Local Development**: Both URLs can be the same direct connection string
4. Format: `postgresql://username:password@host:port/database?schema=public`

#### Clerk Keys

1. Sign up at [Clerk](https://clerk.com/)
2. Create a new application
3. Go to **API Keys** in your Clerk dashboard
4. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gideonadeti/taskflow.git
cd taskflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add all required environment variables (see [Environment Variables](#environment-variables) section above).

### 4. Set Up the Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view/edit database
npx prisma studio
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 6. Build for Production

```bash
npm run build
npm start
```

## Database Setup

### Initial Migration

The first time you set up the database, run:

```bash
npx prisma migrate dev --name init
```

This will:

- Create the database schema
- Generate Prisma Client
- Apply all migrations

### Database Schema

The application uses two main models:

- **Group**: Contains groups that organize tasks
  - `id`: Unique identifier (CUID)
  - `name`: Group name (1-100 characters)
  - `userId`: Owner's user ID
  - `createdAt`, `updatedAt`: Timestamps

- **Task**: Contains individual tasks
  - `id`: Unique identifier (CUID)
  - `title`: Task title (1-200 characters)
  - `description`: Optional task description (max 1000 characters)
  - `priority`: Priority level (low, medium, high)
  - `dueDate`: Optional due date
  - `completed`: Completion status (boolean)
  - `groupId`: Foreign key to Group
  - `userId`: Owner's user ID
  - `createdAt`, `updatedAt`: Timestamps

### Useful Prisma Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio

# Format Prisma schema
npx prisma format

# Validate Prisma schema
npx prisma validate
```

## Testing

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- __tests__/services/task-service.test.ts

# Run tests matching a pattern
npm test -- --grep "TaskService"
```

### Test Structure

- **Unit Tests**: Test individual functions, utilities, and services
  - `__tests__/lib/`: Validation schemas and utilities
  - `__tests__/services/`: Business logic tests

- **Integration Tests**: Test API routes and component interactions
  - `__tests__/api/`: API route handlers
  - `__tests__/components/`: React component tests

For detailed information about the test infrastructure, see [`__tests__/README.md`](__tests__/README.md).

### Writing Tests

1. **Unit Tests**: Create test files alongside source files or in `__tests__/lib/` or `__tests__/services/`
2. **Integration Tests**: Add tests to `__tests__/api/` following the route structure
3. **Component Tests**: Add tests to `__tests__/components/`

Example test structure:

```typescript
import { describe, it, expect } from "vitest";

describe("FeatureName", () => {
  it("should do something", () => {
    // Test implementation
  });
});
```

## Project Structure

```text
taskflow/
├── __tests__/              # Test files
│   ├── api/               # API route tests
│   ├── lib/               # Utility tests
│   ├── services/          # Service tests
│   └── setup.ts           # Test setup and mocks
├── docs/                  # Documentation
│   └── API.md            # API documentation
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma     # Database schema
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── (auth)/       # Authentication routes
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and helpers
│   │   ├── auth/         # Authentication utilities
│   │   ├── db/           # Database queries
│   │   ├── errors/       # Error handling
│   │   └── validations/  # Zod schemas
│   ├── services/         # Business logic services
│   └── types/            # TypeScript type definitions
├── .env.local            # Environment variables (not committed)
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vitest.config.mts     # Vitest configuration
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build application for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm test` | Run test suite with Vitest |
| `npm test -- --watch` | Run tests in watch mode |
| `npm test -- --coverage` | Run tests with coverage report |

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
2. **Write or update tests** for your changes
3. **Run tests** to ensure everything passes:

   ```bash
   npm test
   ```

4. **Run linting** to check code quality:

   ```bash
   npm run lint
   ```

5. **Test your changes** locally in development mode

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
   - Ensure all tests pass and linting is clean

### Code Style Guidelines

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Follow existing code style and formatting
- **Naming**: Use descriptive names for variables, functions, and components
- **Comments**: Add comments for complex logic
- **Testing**: Write tests for new features and bug fixes
- **Documentation**: Update documentation for API or behavior changes

### Commit Message Format

Use clear, descriptive commit messages:

```text
type: short description

Longer explanation if needed
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

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

Ensure all environment variables from [Environment Variables](#environment-variables) are set in your production environment.

### Database Migrations in Production

Run migrations on your production database:

```bash
npx prisma migrate deploy
```

**⚠️ Warning**: Always test migrations in a staging environment first!

## Documentation

- **[API Documentation](docs/API.md)**: Complete API reference with request/response examples
- **[Test Documentation](__tests__/README.md)**: Testing infrastructure and guidelines

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
