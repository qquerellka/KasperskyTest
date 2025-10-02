import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetUsersQuery,
  useGetGroupsQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} from "../svc/api";
import SearchInput from "../components/SearchInput";
import Pagination from "../components/Pagination";
import { clsx } from "clsx";
import { useMediaQuery } from "../hooks/useMediaQuery";

type SortField = "createdAt" | "lastName" | "email" | "title";
type SortDir = "asc" | "desc";

export default function UsersPage() {
  const isMobile = useMediaQuery("(max-width: 720px)");

  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [q, setQ] = useState("");
  const [groupId, setGroupId] = useState<number | undefined>(undefined);
  const [ungroupedOnly, setUngroupedOnly] = useState(false);
  const [{ field, dir }, setSort] = useState<{ field: SortField; dir: SortDir }>(
    { field: "createdAt", dir: "desc" }
  );

  const sortParam = `${field}:${dir}`;
  const usersQ = useGetUsersQuery({ page, perPage, q, sort: sortParam, groupId, ungroupedOnly });
  const groupsQ = useGetGroupsQuery();

  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  function toggleSort(f: SortField) {
    setSort((s) =>
      s.field === f ? { field: f, dir: s.dir === "asc" ? "desc" : "asc" } : { field: f, dir: "asc" }
    );
  }

  async function onCreate() {
    const firstName = prompt("Имя:")?.trim();
    if (!firstName) return;
    const lastName = prompt("Фамилия:")?.trim() || "User";
    const email = prompt("E-mail:")?.trim();
    if (!email) return;
    await createUser({ firstName, lastName, email }).unwrap();
  }

  async function onDelete(id: number) {
    if (confirm("Удалить пользователя?")) await deleteUser(id).unwrap();
  }

  return (
    <div className="card">
      <div className="toolbar">
        <div className="controls">
          <SearchInput value={q} onChange={(v) => { setPage(1); setQ(v); }} />
          <select
            className="select"
            value={groupId ?? ""}
            onChange={(e) => {
              setGroupId(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
          >
            <option value="">Все группы</option>
            {groupsQ.data?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.membersCount})
              </option>
            ))}
          </select>

          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={ungroupedOnly}
              onChange={(e) => {
                setUngroupedOnly(e.target.checked);
                setPage(1);
              }}
            />
            Только без группы
          </label>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={onCreate}>
            + Новый пользователь
          </button>
        </div>
      </div>

      {!isMobile ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <Th label="Фамилия" active={field === "lastName"} dir={dir} onClick={() => toggleSort("lastName")} />
                <Th label="Имя" active={field === "createdAt"} dir={dir} onClick={() => toggleSort("createdAt")} />
                <Th label="Email" active={field === "email"} dir={dir} onClick={() => toggleSort("email")} />
                <Th label="Должность" active={field === "title"} dir={dir} onClick={() => toggleSort("title")} />
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usersQ.isLoading && (
                <tr>
                  <td colSpan={6}>Загрузка...</td>
                </tr>
              )}
              {usersQ.data?.items.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link to={`/users/${u.id}`}>{u.lastName}</Link>
                  </td>
                  <td>{u.firstName}</td>
                  <td>{u.email}</td>
                  <td>{u.title ?? "—"}</td>
                  <td>
                    <span className="badge">{u.isActive ? "active" : "inactive"}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn" onClick={() => onDelete(u.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards">
          {usersQ.isLoading && <div className="badge">Загрузка…</div>}
          {usersQ.data?.items.map((u) => (
            <article className="user-card" key={u.id}>
              <div className="uc-header">
                <Link to={`/users/${u.id}`} className="uc-name">
                  {u.lastName} {u.firstName}
                </Link>
                <span className={clsx("badge", u.isActive ? "ok" : "muted")}>
                  {u.isActive ? "active" : "inactive"}
                </span>
              </div>
              <div className="uc-row">
                <span className="uc-label">Email</span>
                <span className="uc-value">{u.email}</span>
              </div>
              <div className="uc-row">
                <span className="uc-label">Должность</span>
                <span className="uc-value">{u.title ?? "—"}</span>
              </div>
              <div className="uc-actions">
                <Link className="btn primary" to={`/users/${u.id}`}>Открыть</Link>
                <button className="btn" onClick={() => onDelete(u.id)}>Удалить</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <div className="badge">найдено: {usersQ.data?.total ?? 0}</div>
        <Pagination page={page} perPage={perPage} total={usersQ.data?.total ?? 0} onPage={setPage} />
      </div>
    </div>
  );
}

function Th({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active?: boolean;
  dir?: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th onClick={onClick} className={clsx(active && "active")}>
      {label} {active ? (dir === "asc" ? "▲" : "▼") : ""}
    </th>
  );
}
