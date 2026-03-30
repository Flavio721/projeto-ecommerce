import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>

        <div className={styles.brand}>
          <span className={styles.logo}>VESTE</span>
          <p className={styles.tagline}>Moda com intenção.</p>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Loja</h4>
            <Link to="/categoria/novidades">Novidades</Link>
            <Link to="/categoria/feminino">Feminino</Link>
            <Link to="/categoria/masculino">Masculino</Link>
            <Link to="/categoria/sale">Sale</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Conta</h4>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Criar conta</Link>
            <Link to="/conta">Meus pedidos</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Ajuda</h4>
            <a href="#">Trocas e devoluções</a>
            <a href="#">Guia de tamanhos</a>
            <a href="#">Contato</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Veste. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}