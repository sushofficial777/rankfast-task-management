import moment from "moment";

export const hourOptions = (hours: number = 10) => Array.from({ length: hours }, (_, i) => ({
  label: `In ${i + 1} minut${i + 1 > 1 ? "s" : ""}`,
  value: (i + 1).toString(),
}));

export const getDisplayDate = (dueDateStr: Date) => {
  const dueDate = moment(dueDateStr).startOf("day");
  const today = moment().startOf("day");

  if (dueDate.isSame(today)) {
    return "Today";
  }

  if (dueDate.isSame(moment(today).add(1, "days"))) {
    return "Tomorrow";
  }

  if (dueDate.isSame(today, "week") && dueDate.isAfter(today)) {
    return "This week";
  }

  return "Other";
}


export const  getTimeSpentPercentage = (startedAt:any, totalTimeHours:any) => {
  if (!startedAt || !totalTimeHours || totalTimeHours <= 0) return 0;

  const now: any = new Date();
  const start : any = new Date(startedAt);

  const elapsedMilliseconds = now - start;
  const totalMilliseconds = totalTimeHours * 60 * 60 * 1000;

  const percentage = (elapsedMilliseconds / totalMilliseconds) * 100;

  // Clamp percentage between 0 and 100
  return Math.min(Math.max(percentage, 0), 100).toFixed(2);
}
