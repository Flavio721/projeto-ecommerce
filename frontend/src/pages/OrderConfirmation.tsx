import { useParams } from "react-router-dom";
import { ButtonLink } from "../components/layout/ui/ButtonLink";
import styles from "./OrderConfirmation.module.css";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const MOCK_ORDER = {
  id: "1234",
  status: "PAYMENT_CONFIRMED",
  createdAt: new Date().toLocaleDateString("pt-BR"),
  items: [
    { name: "Jaqueta Couro Sintético", variant: "Preto · M", qty: 1, price: 479.9 },
    { name: "Calça Wide Leg Bege", variant: "Bege · G", qty: 2, price: 349.9 },
  ],
  address: "Rua das Flores, 123 – São Paulo, SP",
  paymentMethod: "Cartão de crédito •••• 4242",
  total: 1061.73,
};

const STATUS_STEPS = [
  { key: "PAYMENT_CONFIRMED", label: "Pagamento confirmado" },
  { key: "PREPARING",         label: "Preparando pedido" },
  { key: "SHIPPED",           label: "Enviado" },
  { key: "DELIVERED",         label: "Entregue" },
];

export function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const order = MOCK_ORDER;
  const currentStep = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.checkIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className={styles.title}>Pedido confirmado!</h1>
          <p className={styles.subtitle}>
            Pedido <strong>#{order.id}</strong> · {order.createdAt}
          </p>
          <p className={styles.email}>
            Você receberá atualizações por e-mail em cada etapa.
          </p>
        </div>

        <div className={styles.layout}>
          {/* ── Status timeline ── */}
          <div className={styles.main}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Status do pedido</h2>
              <div className={styles.timeline}>
                {STATUS_STEPS.map((step, i) => {
                  const isDone    = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={step.key} className={styles.timelineItem}>
                      <div className={styles.timelineLeft}>
                        <div className={`${styles.timelineDot} ${isDone ? styles.dotDone : ""} ${isCurrent ? styles.dotCurrent : ""}`}>
                          {isDone && !isCurrent ? "✓" : i + 1}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`${styles.timelineLine} ${isDone ? styles.lineDone : ""}`} />
                        )}
                      </div>
                      <div className={styles.timelineContent}>
                        <p className={`${styles.timelineLabel} ${isCurrent ? styles.currentLabel : ""}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className={styles.timelineNote}>Em andamento</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Itens do pedido</h2>
              <div className={styles.itemList}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <div>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemVariant}>{item.variant} · ×{item.qty}</p>
                    </div>
                    <span className={styles.itemPrice}>{formatBRL(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.totalValue}>{formatBRL(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar info ── */}
          <aside className={styles.sidebar}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Entrega</h2>
              <p className={styles.infoText}>{order.address}</p>
            </div>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Pagamento</h2>
              <p className={styles.infoText}>{order.paymentMethod}</p>
            </div>

            <div className={styles.actions}>
              <ButtonLink to="/conta" variant="outline" fullWidth>
                Meus pedidos
              </ButtonLink>
              <ButtonLink to="/" fullWidth>
                Continuar comprando
              </ButtonLink>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}