import { useState } from "react";
import styles from "./Admin.module.css";

const MOCK_ORDERS = [
  { id: "1234", customer: "João D.",    date: "28/03/2026", total: 1061.73, status: "PAYMENT_CONFIRMED", statusLabel: "Pag. confirmado" },
  { id: "1233", customer: "Ana L.",     date: "27/03/2026", total: 479.9,   status: "SHIPPED",           statusLabel: "Enviado"          },
  { id: "1232", customer: "Carlos M.",  date: "26/03/2026", total: 699.8,   status: "PREPARING",         statusLabel: "Preparando"       },
  { id: "1231", customer: "Beatriz R.", date: "25/03/2026", total: 349.9,   status: "DELIVERED",         statusLabel: "Entregue"         },
  { id: "1230", customer: "Fernanda S.",date: "24/03/2026", total: 259.9,   status: "CANCELLED",         statusLabel: "Cancelado"        },
];

const STATUS_FILTER = ["Todos", "PAYMENT_CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_LABELS: Record<string, string> = {
  PAYMENT_CONFIRMED: "Pag. confirmado", PREPARING: "Preparando",
  SHIPPED: "Enviado", DELIVERED: "Entregue", CANCELLED: "Cancelado",
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AdminOrders() {
  const [filter, setFilter] = useState("Todos");

  const filtered = filter === "Todos"
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === filter);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Pedidos</h1>
      </div>

      {/* Status filter pills */}
      <div className={styles.filterPills}>
        {STATUS_FILTER.map((s) => (
          <button
            key={s}
            className={`${styles.filterPill} ${filter === s ? styles.filterPillActive : ""}`}
            onClick={() => setFilter(s)}
          >
            {s === "Todos" ? "Todos" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Data</th>
              <th className={styles.textRight}>Total</th>
              <th>Status</th>
              <th>Atualizar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td className={styles.orderId}>#{o.id}</td>
                <td>{o.customer}</td>
                <td className={styles.muted}>{o.date}</td>
                <td className={styles.textRight}>{formatBRL(o.total)}</td>
                <td>
                  <span className={`${styles.pill} ${styles[`status_${o.status}`]}`}>
                    {o.statusLabel}
                  </span>
                </td>
                <td>
                  <select className={styles.statusSelect} defaultValue={o.status}>
                    {["PAYMENT_CONFIRMED","PREPARING","SHIPPED","DELIVERED","CANCELLED"].map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}