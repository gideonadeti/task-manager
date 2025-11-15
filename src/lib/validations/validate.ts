import { z } from "zod";
import { NextResponse } from "next/server";

/**
 * Validates request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data or throws NextResponse with 400 status
 */
export function validateRequestBody<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    throw NextResponse.json(
      {
        error: "Validation failed",
        details: errors,
      },
      { status: 400 }
    );
  }

  return result.data;
}

/**
 * Validates route parameters against a Zod schema
 * @param schema - Zod schema to validate against
 * @param params - Params to validate
 * @returns Validated params or throws NextResponse with 400 status
 */
export function validateParams<T extends z.ZodType>(
  schema: T,
  params: unknown
): z.infer<T> {
  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    throw NextResponse.json(
      {
        error: "Invalid parameters",
        details: errors,
      },
      { status: 400 }
    );
  }

  return result.data;
}

