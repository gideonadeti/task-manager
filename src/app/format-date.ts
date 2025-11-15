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
  const time = format(date, "p");

  if (isToday(date)) {
    return `Today at ${time}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${time}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow at ${time}`;
  } else if (isThisWeek(date)) {
    // For dates in the current week, distinguish between past and future
    const dayName = isPast(date) ? `Last ${format(date, "EEEE")}` : `This ${format(date, "EEEE")}`;
    return `${dayName} at ${time}`;
  } else if (isThisYear(date)) {
    return `${format(date, "MMM d")} at ${time}`;
  } else {
    return `${format(date, "MMM d, yyyy")} at ${time}`;
  }
};

export default formatDate;
