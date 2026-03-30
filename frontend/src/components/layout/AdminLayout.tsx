import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";

const NAV = [
  { to: "/admin",          label: "Dashboard",  exact: true },
  { to: "/admin/produtos", label: "Produtos" },
  { to: "/admin/pedidos",  label: "Pedidos" },
];

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logo}>VESTE</span>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.bottom}>
          <NavLink to="/" className={styles.storeLink}>← Ver loja</NavLink>
          <button className={styles.logoutBtn}>Sair</button>
        </div>
      </aside>

      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}