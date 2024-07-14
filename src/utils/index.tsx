export const formatTime = (seconds: number) => {
  const getTwoDigitValue = (value: number) => value.toString().padStart(2, "0");
  const hrs = getTwoDigitValue(Math.floor(seconds / 3600));
  const mins = getTwoDigitValue(Math.floor((seconds % 3600) / 60));
  const secs = getTwoDigitValue(seconds % 60);
  return `${hrs}:${mins}:${secs}`;
};

export const formatTodayTime = (seconds: number) => {
  const getTwoDigitValue = (value: number) => value.toString().padStart(1, "0");
  const hrs = getTwoDigitValue(Math.floor(seconds / 3600));
  const mins = getTwoDigitValue(Math.floor((seconds % 3600) / 60));
  return `${hrs} hrs ${mins} mins`;
};
