import { describe, it, expect } from "vitest";
import { z } from "zod";
import { NextResponse } from "next/server";
import { validateRequestBody, validateParams } from "@/lib/validations/validate";

describe("Validation Utilities", () => {
  describe("validateRequestBody", () => {
    it("returns validated data for valid input", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const data = { name: "John", age: 30 };
      const result = validateRequestBody(schema, data);

      expect(result).toEqual(data);
    });

    it("throws NextResponse with 400 status for invalid input", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const data = { name: "John", age: "invalid" };

      try {
        validateRequestBody(schema, data);
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        const response = error as NextResponse;
        expect(response.status).toBe(400);
      }
    });
  });

  describe("validateParams", () => {
    it("returns validated params for valid input", () => {
      const schema = z.object({
        id: z.string(),
      });

      const params = { id: "123" };
      const result = validateParams(schema, params);

      expect(result).toEqual(params);
    });

    it("throws NextResponse with 400 status for invalid params", () => {
      const schema = z.object({
        id: z.string().min(1, "ID is required"),
      });

      const params = { id: "" };

      try {
        validateParams(schema, params);
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        const response = error as NextResponse;
        expect(response.status).toBe(400);
      }
    });
  });
});

