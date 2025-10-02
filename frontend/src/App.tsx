import { Outlet, NavLink } from "react-router-dom";

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <NavLink to="/users" className="brand">Users Admin</NavLink>
          <a href={import.meta.env.VITE_API_URL + "/docs"} target="_blank" rel="noreferrer">API Docs</a>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">© Test Task</footer>
    </div>
  );
}
