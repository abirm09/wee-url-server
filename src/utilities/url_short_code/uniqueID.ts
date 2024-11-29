const GenerateUniqueId = () => {
  const randomPart = Math.floor(Math.random() * 1_000_000 + 1);
  const timePart = Date.now();
  const uniqueId = Number(String(randomPart) + String(timePart));
  return uniqueId;
};

export default GenerateUniqueId;
