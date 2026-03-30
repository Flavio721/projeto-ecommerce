import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/layout/ui/Button";
import styles from "./Auth.module.css";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    // TODO: chamar POST /auth/login
    setLoading(false);
    navigate("/");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brandMark}>VESTE</div>
        <h1 className={styles.title}>Bem-vindo de volta</h1>
        <p className={styles.subtitle}>Entre na sua conta para continuar</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Senha</label>
              <a href="#" className={styles.forgotLink}>Esqueci minha senha</a>
            </div>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <Button type="submit" size="lg" fullWidth loading={loading}>
            Entrar
          </Button>
        </form>

        <p className={styles.switchText}>
          Não tem uma conta?{" "}
          <Link to="/cadastro" className={styles.switchLink}>Criar conta</Link>
        </p>
      </div>
    </div>
  );
}