/**
 * Simple structured logger
 */
interface LogContext {
  [key: string]: unknown;
}

export const logger = {
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const log = {
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...(("code" in error) && { code: error.code }),
        },
      }),
      ...(context && { context }),
    };

    if (process.env.NODE_ENV === "production") {
      console.error(JSON.stringify(log));
    } else {
      console.error(log);
    }
  },

  warn(message: string, context?: LogContext): void {
    const log = {
      timestamp: new Date().toISOString(),
      level: "warn",
      message,
      ...(context && { context }),
    };

    if (process.env.NODE_ENV === "production") {
      console.warn(JSON.stringify(log));
    } else {
      console.warn(log);
    }
  },
};

