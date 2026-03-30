import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/layout/ui/Button";
import styles from "./Auth.module.css";

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    // TODO: chamar POST /auth/register
    setLoading(false);
    navigate("/");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brandMark}>VESTE</div>
        <h1 className={styles.title}>Criar conta</h1>
        <p className={styles.subtitle}>Junte-se à Veste e descubra sua coleção</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nome completo</label>
            <input className={styles.input} type="text" value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Seu nome" required autoComplete="name" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input className={styles.input} type="email" value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="seu@email.com" required autoComplete="email" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input className={styles.input} type="password" value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Mínimo 8 caracteres" required minLength={8} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirmar senha</label>
            <input className={styles.input} type="password" value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              placeholder="Repita a senha" required />
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading}>
            Criar conta
          </Button>
        </form>

        <p className={styles.switchText}>
          Já tem uma conta?{" "}
          <Link to="/login" className={styles.switchLink}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}