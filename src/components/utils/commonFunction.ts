export const convertToISO8601 = (
  date: string,
  time: string,
  addHour?: number
): string => {
  const dateAndTimeString = `${date}T${time}:00`;
  const dateTime = new Date(dateAndTimeString);

  if (addHour) {
    dateTime.setHours(dateTime.getHours() + addHour);
  }

  return dateTime.toISOString();
};
