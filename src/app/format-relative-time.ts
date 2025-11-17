import {
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isPast,
  differenceInHours,
  differenceInDays,
} from "date-fns";

/**
 * Formats a date to show relative time (e.g., "Due in 2 hours", "Overdue by 3 days")
 */
export default function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();

  if (isToday(dateObj)) {
    const hours = Math.round(differenceInHours(dateObj, now));
    if (hours > 0) {
      return `Due in ${hours} ${hours === 1 ? "hour" : "hours"}`;
    } else if (hours < 0) {
      const overdueHours = Math.abs(hours);
      return `Overdue by ${overdueHours} ${overdueHours === 1 ? "hour" : "hours"}`;
    } else {
      return "Due today";
    }
  }

  if (isTomorrow(dateObj)) {
    return "Due tomorrow";
  }

  if (isPast(dateObj)) {
    const days = differenceInDays(now, dateObj);
    return `Overdue by ${days} ${days === 1 ? "day" : "days"}`;
  }

  // Future date
  const days = differenceInDays(dateObj, now);
  if (days <= 7) {
    return `Due in ${days} ${days === 1 ? "day" : "days"}`;
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
}

