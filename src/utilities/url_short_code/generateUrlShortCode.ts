import GenerateUniqueId from "./uniqueID";

export const GenerateUrlShortCode = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const base = characters.length;

  const toBase62 = (num: number) => {
    let result = "";
    while (num > 0) {
      result = characters[num % base] + result;
      num = Math.floor(num / base);
    }
    return result || "0";
  };
  const id = GenerateUniqueId();
  const shortCode = toBase62(id);
  return shortCode;
};
