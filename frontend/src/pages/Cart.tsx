import { useState } from "react";
import { Link } from "react-router-dom";
import { ButtonLink } from "../components/layout/ui/ButtonLink";
import styles from "./Cart.module.css";

// ─── Mock data ─────────────────────────────────────────────────────
const INITIAL_ITEMS = [
  {
    id: 1,
    variantId: 10,
    name: "Jaqueta Couro Sintético",
    color: "Preto",
    size: "M",
    price: 479.9,
    quantity: 1,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80",
    slug: "jaqueta-couro-sintetico",
  },
  {
    id: 2,
    variantId: 22,
    name: "Calça Wide Leg Bege",
    color: "Bege",
    size: "G",
    price: 349.9,
    quantity: 2,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4f5a95?w=300&q=80",
    slug: "calca-wide-leg-bege",
  },
];
// ───────────────────────────────────────────────────────────────────

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Cart() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  function updateQty(id: number, delta: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function applyCoupon() {
    if (coupon.toUpperCase() === "VESTE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Cupom inválido ou expirado.");
      setCouponApplied(false);
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 500 ? 0 : 29.9;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className="container">
          <BagEmptyIcon />
          <h2 className={styles.emptyTitle}>Seu carrinho está vazio</h2>
          <p className={styles.emptyText}>Explore nossa coleção e encontre algo que você ame.</p>
          <ButtonLink to="/" size="lg">Explorar produtos</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Carrinho</h1>

        <div className={styles.layout}>
          {/* ── Item list ── */}
          <div className={styles.itemList}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <Link to={`/produto/${item.slug}`} className={styles.itemImage}>
                  <img src={item.imageUrl} alt={item.name} />
                </Link>

                <div className={styles.itemInfo}>
                  <div className={styles.itemHeader}>
                    <div>
                      <Link to={`/produto/${item.slug}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      <p className={styles.itemVariant}>
                        {item.color} · {item.size}
                      </p>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                      aria-label="Remover item"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className={styles.itemFooter}>
                    <div className={styles.qtyRow}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, -1)}
                        aria-label="Diminuir"
                      >−</button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, 1)}
                        aria-label="Aumentar"
                      >+</button>
                    </div>
                    <span className={styles.itemPrice}>
                      {formatBRL(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumo do pedido</h2>

            {/* Coupon */}
            <div className={styles.couponRow}>
              <input
                className={`${styles.couponInput} ${couponError ? styles.inputError : ""} ${couponApplied ? styles.inputSuccess : ""}`}
                type="text"
                placeholder="Código do cupom"
                value={coupon}
                onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                disabled={couponApplied}
              />
              <button
                className={styles.couponBtn}
                onClick={applyCoupon}
                disabled={!coupon || couponApplied}
              >
                {couponApplied ? "✓" : "Aplicar"}
              </button>
            </div>
            {couponError && <p className={styles.couponError}>{couponError}</p>}
            {couponApplied && <p className={styles.couponSuccess}>Cupom VESTE10 aplicado — 10% off</p>}

            {/* Totals */}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>{formatBRL(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <span>Desconto</span>
                  <span>− {formatBRL(discount)}</span>
                </div>
              )}
              <div className={styles.totalRow}>
                <span>Frete</span>
                <span>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</span>
              </div>
              {shipping === 0 && (
                <p className={styles.freeShipping}>Você ganhou frete grátis!</p>
              )}
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>{formatBRL(total)}</span>
              </div>
            </div>

            <ButtonLink to="/checkout" size="lg" fullWidth>
              Finalizar compra
            </ButtonLink>

            <Link to="/" className={styles.continueShopping}>
              ← Continuar comprando
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function BagEmptyIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}