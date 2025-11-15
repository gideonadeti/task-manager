import {
  format,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisYear,
  isPast,
} from "date-fns";

const formatDate = (date: Date) => {
  const absolute = format(date, "p");

  if (isToday(date)) {
    return `Today at ${absolute}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${absolute}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow at ${absolute}`;
  } else if (isThisWeek(date)) {
    // For dates in the current week, distinguish between past and future
    if (isPast(date)) {
      return `Last ${format(date, "EEEE")}`;
    } else {
      return `This ${format(date, "EEEE")}`;
    }
  } else if (isThisYear(date)) {
    return `${format(date, "MMM d")}`;
  } else {
    return `${format(date, "MMM d, yyyy")}`;
  }
};

export default formatDate;
