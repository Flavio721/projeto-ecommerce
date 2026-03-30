import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  slug: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  discountPrice?: number;
  category?: string;
  isNew?: boolean;
}

export function ProductCard({
  slug,
  name,
  imageUrl,
  basePrice,
  discountPrice,
  category,
  isNew,
}: ProductCardProps) {
  const hasDiscount = discountPrice != null && discountPrice < basePrice;

  return (
    <Link to={`/produto/${slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={name} className={styles.image} loading="lazy" />

        {isNew && <span className={styles.tagNew}>Novo</span>}
        {hasDiscount && <span className={styles.tagSale}>Sale</span>}

        <div className={styles.overlay}>
          <span className={styles.quickView}>Ver produto</span>
        </div>
      </div>

      <div className={styles.info}>
        {category && <span className={styles.category}>{category}</span>}
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.pricing}>
          {hasDiscount ? (
            <>
              <span className={styles.originalPrice}>
                {formatBRL(basePrice)}
              </span>
              <span className={styles.salePrice}>
                {formatBRL(discountPrice!)}
              </span>
            </>
          ) : (
            <span className={styles.price}>{formatBRL(basePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}