import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Novidades", href: "/categoria/novidades" },
  { label: "Feminino", href: "/categoria/feminino" },
  { label: "Masculino", href: "/categoria/masculino" },
  { label: "Sale", href: "/categoria/sale" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Fecha menu ao trocar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>

        {/* Mobile menu button */}
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span className={`${styles.menuLine} ${menuOpen ? styles.open : ""}`} />
          <span className={`${styles.menuLine} ${menuOpen ? styles.open : ""}`} />
        </button>

        {/* Nav — desktop */}
        <nav className={styles.nav} aria-label="Categorias">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logo — center */}
        <Link to="/" className={styles.logo} aria-label="VESTE — Página inicial">
          VESTE
        </Link>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/conta" className={styles.actionBtn} aria-label="Minha conta">
            <UserIcon />
          </Link>
          <Link to="/carrinho" className={styles.actionBtn} aria-label="Carrinho (2 itens)">
            <BagIcon />
            {/* Badge de quantidade — virá do store futuramente */}
            <span className={styles.badge}>2</span>
          </Link>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Menu mobile">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={styles.mobileLink}
            >
              {link.label}
            </NavLink>
          ))}
          <div className={styles.mobileDivider} />
          <NavLink to="/login" className={styles.mobileLink}>Entrar</NavLink>
          <NavLink to="/cadastro" className={styles.mobileLink}>Criar conta</NavLink>
        </nav>
      </div>
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}