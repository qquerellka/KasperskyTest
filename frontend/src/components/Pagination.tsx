export default function Pagination({page, perPage, total, onPage}:{page:number; perPage:number; total:number; onPage:(p:number)=>void}){
  const pages = Math.max(1, Math.ceil(total / perPage));
  const prev = ()=> onPage(Math.max(1, page-1));
  const next = ()=> onPage(Math.min(pages, page+1));
  return (
    <div style={{display:"flex", gap:8, alignItems:"center"}}>
      <button className="btn" onClick={prev} disabled={page<=1}>‹</button>
      <span className="badge">страница {page} / {pages}</span>
      <button className="btn" onClick={next} disabled={page>=pages}>›</button>
    </div>
  );
}
