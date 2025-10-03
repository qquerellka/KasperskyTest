import { Outlet, NavLink } from "react-router-dom";

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <NavLink to="/users" className="brand">
            Управление пользователями
          </NavLink>
          <a
            href={import.meta.env.VITE_API_URL + "/docs"}
            target="_blank"
            rel="noreferrer"
          >
            Документация API
          </a>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">© Тестовое задание</footer>
    </div>
  );
}
