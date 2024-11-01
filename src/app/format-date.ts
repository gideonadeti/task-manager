import {
  isToday,
  isYesterday,
  isTomorrow,
  formatDistanceToNow,
  format,
  isThisYear,
} from "date-fns";

export default function formatDate(date: Date | undefined) {
  if (!date) {
    return "undefined";
  }

  const distanceToNow = formatDistanceToNow(date, { addSuffix: true });

  if (isToday(date)) {
    return `${format(date, "h:mm a")} (${distanceToNow})`;
  } else if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, "h:mm a")} (${distanceToNow})`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")} (${distanceToNow})`;
  } else if (isThisYear(date)) {
    return `${format(date, "eee, do MMM")} (${distanceToNow})`;
  } else {
    return `${format(date, "eee, do MMM, yyyy")} (${distanceToNow})`;
  }
}
