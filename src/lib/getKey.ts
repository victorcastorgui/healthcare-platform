export const getKey = (obj: Record<string, number>, id: number) => {
  for (const key in obj) {
    if (obj[key] === id) {
      return key;
    }
  }
};
