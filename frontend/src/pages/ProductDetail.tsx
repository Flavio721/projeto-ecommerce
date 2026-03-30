import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/layout/ui/Button";
import styles from "./ProductDetail.module.css";

// ─── Mock data ─────────────────────────────────────────────────────
const MOCK_PRODUCT = {
  id: 1,
  name: "Jaqueta Couro Sintético",
  description:
    "Corte reto com acabamento premium em couro sintético de alta qualidade. Ideal para composições urbanas e looks noturnos. Forro interno acetinado, bolsos laterais funcionais e zíper YKK.",
  basePrice: 599.9,
  discountPrice: 479.9,
  category: "Masculino",
  images: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85",
    "https://images.unsplash.com/photo-1559551409-daac959f76b8?w=900&q=85",
    "https://images.unsplash.com/photo-1592878849122-facb97ed9e73?w=900&q=85",
  ],
  colors: ["Preto", "Marrom"],
  sizes: ["P", "M", "G", "GG"],
};
// ───────────────────────────────────────────────────────────────────

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = MOCK_PRODUCT; // substituir por fetch via slug

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.basePrice;

  function handleAddToCart() {
    if (!selectedSize) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    // TODO: chamar store de carrinho
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.grid}`}>

        {/* ── Gallery ── */}
        <div className={styles.gallery}>
          <div className={styles.thumbnails}>
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${activeImage === i ? styles.thumbActive : ""}`}
                onClick={() => setActiveImage(i)}
                aria-label={`Foto ${i + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>

          <div className={styles.mainImage}>
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className={styles.heroImg}
            />
            {hasDiscount && <span className={styles.saleTag}>Sale</span>}
          </div>
        </div>

        {/* ── Details ── */}
        <div className={styles.details}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>

          {/* Price */}
          <div className={styles.pricing}>
            {hasDiscount ? (
              <>
                <span className={styles.salePrice}>{formatBRL(product.discountPrice!)}</span>
                <span className={styles.originalPrice}>{formatBRL(product.basePrice)}</span>
                <span className={styles.discountBadge}>
                  −{Math.round((1 - product.discountPrice! / product.basePrice) * 100)}%
                </span>
              </>
            ) : (
              <span className={styles.price}>{formatBRL(product.basePrice)}</span>
            )}
          </div>

          <p className={styles.installment}>
            ou 6× de {formatBRL((product.discountPrice ?? product.basePrice) / 6)} sem juros
          </p>

          {/* Colors */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>
              Cor: <strong>{selectedColor ?? "Selecione"}</strong>
            </span>
            <div className={styles.colorRow}>
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={`${styles.colorOpt} ${selectedColor === c ? styles.colorSelected : ""}`}
                  onClick={() => setSelectedColor(c)}
                  title={c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>
              Tamanho: <strong>{selectedSize ?? "Selecione"}</strong>
            </span>
            <div className={styles.sizeRow}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`${styles.sizeOpt} ${selectedSize === s ? styles.sizeSelected : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <a href="#" className={styles.sizeGuide}>Guia de tamanhos</a>
            )}
          </div>

          {/* Quantity */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>Quantidade</span>
            <div className={styles.qtyRow}>
              <button
                className={styles.qtyBtn}
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                aria-label="Diminuir"
              >−</button>
              <span className={styles.qtyValue}>{qty}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => setQty((v) => v + 1)}
                aria-label="Aumentar"
              >+</button>
            </div>
          </div>

          {/* CTA */}
          <div className={styles.cta}>
            <Button
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
            >
              {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
            </Button>
            {!selectedSize && (
              <p className={styles.sizeWarning}>Selecione um tamanho para continuar</p>
            )}
          </div>

          {/* Description */}
          <div className={styles.descSection}>
            <h3 className={styles.descTitle}>Descrição</h3>
            <p className={styles.desc}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}