export const getDateCustomDaysFromNow = (seconds: number) => {
  const now = new Date();
  const future = new Date(now.getTime() + seconds * 1000);

  return future;
};
