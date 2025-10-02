export function parsePagination(query: any) {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20));
  const skip = (page - 1) * perPage;
  const take = perPage;
  return { page, perPage, skip, take };
}
