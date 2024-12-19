import { describe, it, expect } from "vitest";
import { formatDistanceToNow, format } from "date-fns";

import formatDate from "@/app/format-date";

describe("formatDate", () => {
  it("returns 'undefined' if the input date is undefined", () => {
    const result = formatDate(undefined);
    expect(result).toBe("undefined");
  });

  it("formats today's date correctly", () => {
    const today = new Date();
    const expectedTime = format(today, "h:mm a");
    const distanceToNow = formatDistanceToNow(today, { addSuffix: true });

    const result = formatDate(today);

    expect(result).toBe(`${expectedTime} (${distanceToNow})`);
  });

  it("formats tomorrow's date correctly", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expectedTime = format(tomorrow, "h:mm a");
    const distanceToNow = formatDistanceToNow(tomorrow, { addSuffix: true });

    const result = formatDate(tomorrow);

    expect(result).toBe(`Tomorrow at ${expectedTime} (${distanceToNow})`);
  });

  it("formats yesterday's date correctly", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const expectedTime = format(yesterday, "h:mm a");
    const distanceToNow = formatDistanceToNow(yesterday, { addSuffix: true });

    const result = formatDate(yesterday);

    expect(result).toBe(`Yesterday at ${expectedTime} (${distanceToNow})`);
  });

  it("formats a date in the current year correctly", () => {
    const currentYearDate = new Date();
    currentYearDate.setMonth(5);
    currentYearDate.setDate(15);

    const expectedFormattedDate = format(currentYearDate, "eee, do MMM");
    const distanceToNow = formatDistanceToNow(currentYearDate, {
      addSuffix: true,
    });

    const result = formatDate(currentYearDate);

    expect(result).toBe(`${expectedFormattedDate} (${distanceToNow})`);
  });

  it("formats a date outside the current year correctly", () => {
    const lastYearDate = new Date();
    lastYearDate.setFullYear(new Date().getFullYear() - 1);
    lastYearDate.setMonth(3);
    lastYearDate.setDate(10);

    const expectedFormattedDate = format(lastYearDate, "eee, do MMM, yyyy");
    const distanceToNow = formatDistanceToNow(lastYearDate, {
      addSuffix: true,
    });

    const result = formatDate(lastYearDate);

    expect(result).toBe(`${expectedFormattedDate} (${distanceToNow})`);
  });
});
