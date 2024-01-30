export const adminTableNumbering = (currentPage: number, idx: number) =>
  (currentPage - 1) * 5 + (idx + 1);
