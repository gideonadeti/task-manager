import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";

const formatDate = (date: Date) => {
  const absolute = format(date, "p");

  if (isToday(date)) {
    return `Today at ${absolute}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${absolute}`;
  } else if (isThisWeek(date)) {
    return `Last ${format(date, "EEEE")}`;
  } else if (isThisYear(date)) {
    return `${format(date, "MMM d")}`;
  } else {
    return `${format(date, "MMM d, yyyy")}`;
  }
};

export default formatDate;
