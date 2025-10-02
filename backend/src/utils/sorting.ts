const allowed = new Set(["createdAt","lastName","email","title"]);
export function parseSorting(query: any) {
  const s = (query.sort as string) || "";
  if (!s.includes(":")) return { orderBy: { createdAt: "desc" as const } };
  const [field, dirRaw] = s.split(":");
  const dir = dirRaw === "asc" ? "asc" : "desc";
  if (!allowed.has(field)) return { orderBy: { createdAt: "desc" as const } };
  return { orderBy: { [field]: dir } as any };
}
