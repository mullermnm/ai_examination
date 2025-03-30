export const convertToFloorDate = function(inputDate) {
  const date = new Date(inputDate);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
export const convertToCeilDate = function (inputDate) {
  const date = new Date(inputDate);
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(999);
  return date;
};
