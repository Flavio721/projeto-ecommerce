import styles from "./Admin.module.css";

const STATS = [
  { label: "Receita do mês",    value: "R$ 48.290",  delta: "+12%",  up: true  },
  { label: "Pedidos",           value: "134",         delta: "+8%",   up: true  },
  { label: "Ticket médio",      value: "R$ 360,37",   delta: "-3%",   up: false },
  { label: "Novos clientes",    value: "47",          delta: "+21%",  up: true  },
];

const TOP_PRODUCTS = [
  { name: "Jaqueta Couro Sintético", sales: 42, revenue: "R$ 20.155,80" },
  { name: "Calça Wide Leg Bege",     sales: 38, revenue: "R$ 13.296,20" },
  { name: "Camiseta Oversized",      sales: 61, revenue: "R$ 8.533,90"  },
  { name: "Vestido Midi Floral",     sales: 29, revenue: "R$ 12.467,10" },
];

const RECENT_ORDERS = [
  { id: "1234", customer: "João D.",   total: "R$ 1.061,73", status: "PAYMENT_CONFIRMED", statusLabel: "Pag. confirmado" },
  { id: "1233", customer: "Ana L.",    total: "R$ 479,90",   status: "SHIPPED",           statusLabel: "Enviado"         },
  { id: "1232", customer: "Carlos M.", total: "R$ 699,80",   status: "PREPARING",         statusLabel: "Preparando"      },
  { id: "1231", customer: "Beatriz R.",total: "R$ 349,90",   status: "DELIVERED",         statusLabel: "Entregue"        },
];

export function AdminDashboard() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={`${styles.statDelta} ${s.up ? styles.deltaUp : styles.deltaDown}`}>
              {s.delta} em relação ao mês anterior
            </span>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        {/* ── Top products ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Top produtos</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto</th>
                <th className={styles.textRight}>Vendas</th>
                <th className={styles.textRight}>Receita</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((p, i) => (
                <tr key={p.name}>
                  <td>
                    <span className={styles.rank}>#{i + 1}</span>
                    {p.name}
                  </td>
                  <td className={styles.textRight}>{p.sales}</td>
                  <td className={styles.textRight}>{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Recent orders ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Pedidos recentes</h2>
          <div className={styles.orderList}>
            {RECENT_ORDERS.map((o) => (
              <div key={o.id} className={styles.orderRow}>
                <div>
                  <p className={styles.orderCustomer}>{o.customer}</p>
                  <p className={styles.orderId}>#{o.id}</p>
                </div>
                <div className={styles.orderRight}>
                  <span className={styles.orderStatus}>{o.statusLabel}</span>
                  <span className={styles.orderTotal}>{o.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}