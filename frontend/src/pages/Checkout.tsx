import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/layout/ui/Button";
import styles from "./Checkout.module.css";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const ORDER_SUMMARY = {
  items: [
    { name: "Jaqueta Couro Sintético", variant: "Preto · M", qty: 1, price: 479.9 },
    { name: "Calça Wide Leg Bege", variant: "Bege · G", qty: 2, price: 349.9 },
  ],
  subtotal: 1179.7,
  shipping: 0,
  discount: 117.97,
  total: 1061.73,
};

type Step = "address" | "payment" | "review";

export function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("address");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "", cep: "", street: "", number: "",
    complement: "", city: "", state: "",
  });

  const [payment, setPayment] = useState({
    method: "credit_card",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
  });

  function handleField<T extends object>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    field: keyof T,
    value: string
  ) {
    setter((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePlaceOrder() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800)); // simula chamada API
    navigate("/pedido/1234");
  }

  const steps: { id: Step; label: string }[] = [
    { id: "address", label: "Endereço" },
    { id: "payment", label: "Pagamento" },
    { id: "review",  label: "Revisão" },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>

        {/* ── Progress bar ── */}
        <div className={styles.progress}>
          {steps.map((s, i) => (
            <div key={s.id} className={styles.progressItem}>
              <div
                className={`${styles.progressDot} ${
                  i < stepIndex ? styles.done :
                  i === stepIndex ? styles.current : ""
                }`}
              >
                {i < stepIndex ? "✓" : i + 1}
              </div>
              <span className={`${styles.progressLabel} ${i === stepIndex ? styles.activeLabel : ""}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`${styles.progressLine} ${i < stepIndex ? styles.doneLine : ""}`} />
              )}
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          {/* ── Forms ── */}
          <div className={styles.formArea}>

            {/* Step 1: Address */}
            {step === "address" && (
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Endereço de entrega</h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.field} ${styles.fullCol}`}>
                    <label className={styles.label}>Nome completo</label>
                    <input className={styles.input} value={address.name}
                      onChange={(e) => handleField(setAddress, "name", e.target.value)}
                      placeholder="Seu nome" />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>CEP</label>
                    <input className={styles.input} value={address.cep}
                      onChange={(e) => handleField(setAddress, "cep", e.target.value)}
                      placeholder="00000-000" maxLength={9} />
                  </div>
                  <div className={`${styles.field} ${styles.fullCol}`}>
                    <label className={styles.label}>Rua / Logradouro</label>
                    <input className={styles.input} value={address.street}
                      onChange={(e) => handleField(setAddress, "street", e.target.value)}
                      placeholder="Nome da rua" />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Número</label>
                    <input className={styles.input} value={address.number}
                      onChange={(e) => handleField(setAddress, "number", e.target.value)}
                      placeholder="123" />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Complemento <span className={styles.optional}>(opcional)</span></label>
                    <input className={styles.input} value={address.complement}
                      onChange={(e) => handleField(setAddress, "complement", e.target.value)}
                      placeholder="Apto, bloco..." />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Cidade</label>
                    <input className={styles.input} value={address.city}
                      onChange={(e) => handleField(setAddress, "city", e.target.value)}
                      placeholder="Sua cidade" />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Estado</label>
                    <select className={styles.input} value={address.state}
                      onChange={(e) => handleField(setAddress, "state", e.target.value)}>
                      <option value="">Selecione</option>
                      {["SP","RJ","MG","BA","PR","RS","SC","GO","DF"].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button size="lg" onClick={() => setStep("payment")}
                  disabled={!address.name || !address.cep || !address.street}>
                  Continuar para pagamento
                </Button>
              </section>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Forma de pagamento</h2>
                <div className={styles.methodRow}>
                  {[
                    { value: "credit_card", label: "Cartão de crédito" },
                    { value: "pix",         label: "PIX" },
                    { value: "boleto",       label: "Boleto" },
                  ].map((m) => (
                    <button
                      key={m.value}
                      className={`${styles.methodBtn} ${payment.method === m.value ? styles.methodSelected : ""}`}
                      onClick={() => handleField(setPayment, "method", m.value)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payment.method === "credit_card" && (
                  <div className={styles.formGrid}>
                    <div className={`${styles.field} ${styles.fullCol}`}>
                      <label className={styles.label}>Número do cartão</label>
                      <input className={styles.input} value={payment.cardNumber}
                        onChange={(e) => handleField(setPayment, "cardNumber", e.target.value)}
                        placeholder="0000 0000 0000 0000" maxLength={19} />
                    </div>
                    <div className={`${styles.field} ${styles.fullCol}`}>
                      <label className={styles.label}>Nome no cartão</label>
                      <input className={styles.input} value={payment.cardName}
                        onChange={(e) => handleField(setPayment, "cardName", e.target.value)}
                        placeholder="Como aparece no cartão" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Validade</label>
                      <input className={styles.input} value={payment.expiry}
                        onChange={(e) => handleField(setPayment, "expiry", e.target.value)}
                        placeholder="MM/AA" maxLength={5} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>CVV</label>
                      <input className={styles.input} value={payment.cvv}
                        onChange={(e) => handleField(setPayment, "cvv", e.target.value)}
                        placeholder="000" maxLength={4} type="password" />
                    </div>
                  </div>
                )}

                {payment.method === "pix" && (
                  <div className={styles.pixInfo}>
                    <p>Após confirmar o pedido, você receberá o QR Code PIX.</p>
                    <p className={styles.pixNote}>O pedido expira em <strong>30 minutos</strong>.</p>
                  </div>
                )}

                {payment.method === "boleto" && (
                  <div className={styles.pixInfo}>
                    <p>O boleto será gerado após a confirmação do pedido.</p>
                    <p className={styles.pixNote}>Prazo de compensação: <strong>1-3 dias úteis</strong>.</p>
                  </div>
                )}

                <div className={styles.stepActions}>
                  <button className={styles.backBtn} onClick={() => setStep("address")}>
                    ← Voltar
                  </button>
                  <Button size="lg" onClick={() => setStep("review")}>
                    Revisar pedido
                  </Button>
                </div>
              </section>
            )}

            {/* Step 3: Review */}
            {step === "review" && (
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Revisar e confirmar</h2>

                <div className={styles.reviewBlock}>
                  <h3 className={styles.reviewLabel}>Entrega</h3>
                  <p className={styles.reviewText}>
                    {address.street}, {address.number}
                    {address.complement ? `, ${address.complement}` : ""}<br />
                    {address.city} · {address.state} · {address.cep}
                  </p>
                </div>

                <div className={styles.reviewBlock}>
                  <h3 className={styles.reviewLabel}>Pagamento</h3>
                  <p className={styles.reviewText}>
                    {{ credit_card: "Cartão de crédito", pix: "PIX", boleto: "Boleto" }[payment.method]}
                    {payment.method === "credit_card" && payment.cardNumber &&
                      ` •••• ${payment.cardNumber.slice(-4)}`}
                  </p>
                </div>

                <div className={styles.stepActions}>
                  <button className={styles.backBtn} onClick={() => setStep("payment")}>
                    ← Voltar
                  </button>
                  <Button size="lg" loading={loading} onClick={handlePlaceOrder}>
                    Confirmar pedido
                  </Button>
                </div>
              </section>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Seu pedido</h2>
            <div className={styles.summaryItems}>
              {ORDER_SUMMARY.items.map((item, i) => (
                <div key={i} className={styles.summaryItem}>
                  <div>
                    <p className={styles.summaryItemName}>{item.name}</p>
                    <p className={styles.summaryItemVariant}>{item.variant} · ×{item.qty}</p>
                  </div>
                  <span className={styles.summaryItemPrice}>
                    {formatBRL(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}><span>Subtotal</span><span>{formatBRL(ORDER_SUMMARY.subtotal)}</span></div>
              <div className={`${styles.totalRow} ${styles.discountRow}`}><span>Desconto</span><span>− {formatBRL(ORDER_SUMMARY.discount)}</span></div>
              <div className={styles.totalRow}><span>Frete</span><span>{ORDER_SUMMARY.shipping === 0 ? "Grátis" : formatBRL(ORDER_SUMMARY.shipping)}</span></div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}><span>Total</span><span>{formatBRL(ORDER_SUMMARY.total)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}