import { Link } from "react-router-dom";
import { ButtonLink } from "../components/layout/ui/ButtonLink";
import styles from "./Home.module.css";
import { ProductCard } from "../components/layout/product/ProductCard";

// ─── Mock data (substituir por chamadas de API) ────────────────────────────
const FEATURED_PRODUCTS = [
  {
    slug: "camiseta-oversized-preta",
    name: "Camiseta Oversized Preta",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    basePrice: 189.9,
    discountPrice: 139.9,
    category: "Feminino",
    isNew: false,
  },
  {
    slug: "calca-wide-leg-bege",
    name: "Calça Wide Leg Bege",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4f5a95?w=600&q=80",
    basePrice: 349.9,
    category: "Feminino",
    isNew: true,
  },
  {
    slug: "jaqueta-couro-sintetico",
    name: "Jaqueta Couro Sintético",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    basePrice: 599.9,
    discountPrice: 479.9,
    category: "Masculino",
  },
  {
    slug: "vestido-midi-floral",
    name: "Vestido Midi Floral",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    basePrice: 429.9,
    category: "Feminino",
    isNew: true,
  },
];

const CATEGORIES = [
  {
    label: "Feminino",
    slug: "feminino",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  },
  {
    label: "Masculino",
    slug: "masculino",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
  },
  {
    label: "Sale",
    slug: "sale",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
];
// ───────────────────────────────────────────────────────────────────────────

export function Home() {
  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=85"
            alt="Coleção Inverno 2025"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroEyebrow}>Coleção Inverno 2025</span>
          <h1 className={styles.heroHeading}>
            Peças que<br />
            <em>definem</em><br />
            quem você é.
          </h1>
          <div className={styles.heroCta}>
            <ButtonLink to="/categoria/novidades" size="lg">
              Explorar coleção
            </ButtonLink>
            <Link to="/categoria/sale" className={styles.heroSecondary}>
              Ver ofertas →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categorias ───────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explorar por categoria</h2>
          </header>

          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} to={`/categoria/${cat.slug}`} className={styles.categoryCard}>
                <img src={cat.image} alt={cat.label} className={styles.categoryImage} />
                <div className={styles.categoryOverlay} />
                <span className={styles.categoryLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destaques ────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Em destaque</h2>
            <Link to="/categoria/novidades" className={styles.seeAll}>
              Ver todos →
            </Link>
          </header>

          <div className={styles.productGrid}>
            {FEATURED_PRODUCTS.map((p) => (
              <ProductCard key={p.slug} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner editorial ─────────────────────────── */}
      <section className={styles.banner}>
        <div className={styles.bannerMedia}>
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80"
            alt="Sale até 50%"
            className={styles.bannerImage}
          />
          <div className={styles.bannerOverlay} />
        </div>
        <div className={`container ${styles.bannerContent}`}>
          <span className={styles.bannerEyebrow}>Tempo limitado</span>
          <h2 className={styles.bannerHeading}>Sale<br />até 50% off</h2>
          <ButtonLink to="/categoria/sale" variant="outline" size="lg">
            Aproveitar
          </ButtonLink>
        </div>
      </section>

    </div>
  );
}