/**
 * The function `createId` generates a unique user ID based on the current date, time, and a random
 * number.
 * @returns The `createId` function returns a unique user ID that consists of a combination of the
 * current date, a random number, and a timestamp. The returned user ID is a 10-character string.
 */
const createId = () => {
  const date = new Date();
  const timestamp = date.getTime();
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  const userId = `${String(date.getFullYear()).slice(2)}${date.getMonth() + 1}${date.getDate()}${randomNum}${String(timestamp).split("").reverse().join("")}`;
  return userId.slice(0, 10);
};

export const UserHelper = {
  createId,
};
