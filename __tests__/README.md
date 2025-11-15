# Test Infrastructure

This directory contains the test suite for the task manager application.

## Test Structure

```text
__tests__/
├── setup.ts                    # Global test setup and mocks
├── api/                        # Integration tests for API routes
│   ├── tasks/
│   │   ├── route.test.ts
│   │   └── [taskId]/route.test.ts
│   └── groups/
│       ├── route.test.ts
│       └── [groupId]/route.test.ts
├── lib/                        # Unit tests for utilities
│   └── validations/
│       ├── task.test.ts
│       ├── group.test.ts
│       └── validate.test.ts
├── services/                   # Unit tests for services
│   ├── task-service.test.ts
│   └── group-service.test.ts
└── format-date.test.ts         # Format date utility test
```

## Test Setup

### Configuration

The test configuration is in `vitest.config.mts`:

- Uses `jsdom` environment for React component testing
- Includes setup file for global mocks
- Configured for code coverage reporting

### Global Setup (`__tests__/setup.ts`)

The setup file provides:

1. **Clerk Authentication Mocks**: Mocks `@clerk/nextjs/server` for testing API routes
2. **Mock Cleanup**: Clears all mocks after each test to ensure test isolation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- __tests__/services/task-service.test.ts
```

## Test Types

### Unit Tests

- **Validations** (`lib/validations/*.test.ts`): Tests for Zod schemas and validation functions
- **Services** (`services/*.test.ts`): Tests for business logic with mocked database queries
- **Utilities** (`format-date.test.ts`): Tests for date formatting utility

### Integration Tests

- **API Routes** (`api/**/*.test.ts`): Tests for Next.js API route handlers
  - Tests request/response handling
  - Tests authentication
  - Tests validation
  - Tests error handling

## Mocking

### Clerk Authentication

Clerk server-side authentication is automatically mocked in the setup file. The `auth()` function from `@clerk/nextjs/server` returns a default user ID of `"test-user-id"`.

### Database Queries

Service tests mock the database query functions from `@/lib/db/queries`. This allows testing business logic without a real database. API route tests also mock the service layer.

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Mock external dependencies (database, APIs, authentication)
3. **Coverage**: Aim for high coverage of business logic and critical paths
4. **Naming**: Use descriptive test names that explain what is being tested

## Adding New Tests

1. **Unit Tests**: Create test files in `__tests__/lib/` or `__tests__/services/`
2. **Integration Tests**: Add to `__tests__/api/` following the route structure
3. **Utility Tests**: Add to `__tests__/` root for app-level utilities

## Troubleshooting

### Clerk authentication errors

- Check that Clerk mocks are properly set up in `setup.ts`
- Verify that `getUserId()` is mocked in your test (API route tests should mock it explicitly)

### Database query errors

- Ensure database queries are properly mocked in service tests
- Service tests should mock functions from `@/lib/db/queries`
