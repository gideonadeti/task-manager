/**
 * Simple structured logger
 */
interface LogContext {
  [key: string]: unknown;
}

export const logger = {
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const log: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level: "error",
      message,
    };

    if (error instanceof Error) {
      log.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...("code" in error && {
          code: (error as Error & { code?: unknown }).code,
        }),
      };
    }

    if (context) {
      log.context = context;
    }

    console.error(log);
  },

  warn(message: string, context?: LogContext): void {
    const log: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level: "warn",
      message,
    };

    if (context) {
      log.context = context;
    }

    console.warn(log);
  },
};
