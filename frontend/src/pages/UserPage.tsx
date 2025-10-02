import { useParams, Link } from "react-router-dom";
import { useGetUserQuery, useGetGroupsQuery, useAddToGroupMutation, useRemoveFromGroupMutation, useUpdateUserMutation } from "../svc/api";
import { useState } from "react";

export default function UserPage(){
  const { id } = useParams();
  const userId = Number(id);
  const uq = useGetUserQuery(userId);
  const gq = useGetGroupsQuery();
  const [addToGroup] = useAddToGroupMutation();
  const [removeFromGroup] = useRemoveFromGroupMutation();
  const [updateUser] = useUpdateUserMutation();
  const [editing, setEditing] = useState(false);

  if (uq.isLoading) return <div>Загрузка...</div>;
  if (!uq.data) return <div>Не найдено. <Link to="/users">Назад</Link></div>;

  const u = uq.data;

  async function savePatch(){
    const firstName = (document.getElementById("fn") as HTMLInputElement).value.trim();
    const lastName  = (document.getElementById("ln") as HTMLInputElement).value.trim();
    const title     = (document.getElementById("tt") as HTMLInputElement).value.trim() || null;
    const phone     = (document.getElementById("ph") as HTMLInputElement).value.trim() || null;
    await updateUser({ id: u.id, patch: { firstName, lastName, title, phone } }).unwrap();
    setEditing(false);
  }

  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
        <h2 style={{margin:0}}>{u.firstName} {u.lastName}</h2>
        <Link className="btn" to="/users">← Список</Link>
      </div>

      {!editing ? (
        <div className="grid2">
          <div><b>Email:</b> {u.email}</div>
          <div><b>Телефон:</b> {u.phone ?? "—"}</div>
          <div><b>Должность:</b> {u.title ?? "—"}</div>
          <div><b>Статус:</b> {u.isActive ? "Активен" : "Неактивен"}</div>
        </div>
      ) : (
        <div className="grid2">
          <label>Имя<input id="fn" className="input" defaultValue={u.firstName} /></label>
          <label>Фамилия<input id="ln" className="input" defaultValue={u.lastName} /></label>
          <label>Должность<input id="tt" className="input" defaultValue={u.title ?? ""} /></label>
          <label>Телефон<input id="ph" className="input" defaultValue={u.phone ?? ""} /></label>
        </div>
      )}

      <div style={{marginTop:12, display:"flex", gap:8}}>
        {!editing ? (
          <button className="btn primary" onClick={()=>setEditing(true)}>Редактировать</button>
        ) : (
          <>
            <button className="btn primary" onClick={savePatch}>Сохранить</button>
            <button className="btn" onClick={()=>setEditing(false)}>Отмена</button>
          </>
        )}
      </div>

      <h3>Группы</h3>
      <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
        {u.groups?.map(g => (
          <span key={g.id} className="badge" style={{display:"inline-flex", alignItems:"center", gap:6}}>
            {g.name}
            <button className="btn" onClick={()=>removeFromGroup({id:userId, groupId:g.id})}>×</button>
          </span>
        ))}
      </div>

      <div style={{marginTop:8}}>
        <select className="select" id="groupSelect">
          <option value="">Добавить в группу…</option>
          {gq.data?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button className="btn" onClick={()=>{
          const el = document.getElementById("groupSelect") as HTMLSelectElement;
          const gid = Number(el.value);
          if (gid) addToGroup({ id: userId, groupId: gid });
        }}>Добавить</button>
      </div>
    </div>
  );
}
