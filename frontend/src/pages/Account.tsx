import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/layout/ui/Button";
import styles from "./Account.module.css";

type Tab = "orders" | "profile" | "addresses";

const MOCK_ORDERS = [
  { id: "1234", date: "28/03/2026", status: "PAYMENT_CONFIRMED", statusLabel: "Pagamento confirmado", total: 1061.73, items: 3 },
  { id: "1101", date: "10/02/2026", status: "DELIVERED",          statusLabel: "Entregue",             total: 479.9,  items: 1 },
  { id: "0987", date: "05/01/2026", status: "CANCELLED",          statusLabel: "Cancelado",             total: 259.9,  items: 1 },
];

const STATUS_COLOR: Record<string, string> = {
  PAYMENT_CONFIRMED: "gold",
  PREPARING:         "gold",
  SHIPPED:           "gold",
  DELIVERED:         "green",
  CANCELLED:         "red",
  PENDING:           "muted",
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Account() {
  const [tab, setTab] = useState<Tab>("orders");

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>

          {/* ── Sidebar ── */}
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.avatar}>JD</div>
              <div>
                <p className={styles.userName}>João D.</p>
                <p className={styles.userEmail}>joao@email.com</p>
              </div>
            </div>

            <nav className={styles.nav}>
              {(["orders", "profile", "addresses"] as Tab[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.navBtn} ${tab === t ? styles.navActive : ""}`}
                  onClick={() => setTab(t)}
                >
                  {{ orders: "Meus pedidos", profile: "Meus dados", addresses: "Endereços" }[t]}
                </button>
              ))}
            </nav>

            <button className={styles.logoutBtn}>Sair da conta</button>
          </aside>

          {/* ── Main content ── */}
          <main className={styles.main}>

            {/* Orders */}
            {tab === "orders" && (
              <div>
                <h1 className={styles.sectionTitle}>Meus pedidos</h1>
                <div className={styles.orderList}>
                  {MOCK_ORDERS.map((order) => (
                    <Link key={order.id} to={`/pedido/${order.id}`} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <span className={styles.orderId}>Pedido #{order.id}</span>
                        <span className={`${styles.orderStatus} ${styles[`status_${STATUS_COLOR[order.status]}`]}`}>
                          {order.statusLabel}
                        </span>
                      </div>
                      <div className={styles.orderMeta}>
                        <span>{order.date}</span>
                        <span>{order.items} {order.items === 1 ? "item" : "itens"}</span>
                        <span className={styles.orderTotal}>{formatBRL(order.total)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Profile */}
            {tab === "profile" && (
              <div>
                <h1 className={styles.sectionTitle}>Meus dados</h1>
                <div className={styles.card}>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>Nome completo</label>
                      <input className={styles.input} defaultValue="João D." />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Telefone</label>
                      <input className={styles.input} defaultValue="(11) 99999-0000" />
                    </div>
                    <div className={`${styles.field} ${styles.fullCol}`}>
                      <label className={styles.label}>E-mail</label>
                      <input className={styles.input} type="email" defaultValue="joao@email.com" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Nova senha</label>
                      <input className={styles.input} type="password" placeholder="••••••••" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Confirmar senha</label>
                      <input className={styles.input} type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <Button size="md">Salvar alterações</Button>
                </div>
              </div>
            )}

            {/* Addresses */}
            {tab === "addresses" && (
              <div>
                <h1 className={styles.sectionTitle}>Endereços</h1>
                <div className={styles.addressList}>
                  <div className={styles.addressCard}>
                    <div className={styles.addressInfo}>
                      <span className={styles.defaultBadge}>Principal</span>
                      <p className={styles.addressText}>Rua das Flores, 123 – Apto 42</p>
                      <p className={styles.addressCity}>São Paulo, SP · 01310-100</p>
                    </div>
                    <div className={styles.addressActions}>
                      <button className={styles.textBtn}>Editar</button>
                      <button className={`${styles.textBtn} ${styles.deleteBtn}`}>Remover</button>
                    </div>
                  </div>

                  <button className={styles.addAddressBtn}>
                    + Adicionar endereço
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}