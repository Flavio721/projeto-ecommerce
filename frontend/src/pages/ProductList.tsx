import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/layout/product/ProductCard";
import styles from "./ProductList.module.css";

// ─── Mock data ─────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  { slug: "camiseta-oversized-preta", name: "Camiseta Oversized Preta", imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", basePrice: 189.9, discountPrice: 139.9, category: "Feminino" },
  { slug: "calca-wide-leg-bege", name: "Calça Wide Leg Bege", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4f5a95?w=600&q=80", basePrice: 349.9, category: "Feminino", isNew: true },
  { slug: "jaqueta-couro-sintetico", name: "Jaqueta Couro Sintético", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", basePrice: 599.9, discountPrice: 479.9, category: "Masculino" },
  { slug: "vestido-midi-floral", name: "Vestido Midi Floral", imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", basePrice: 429.9, category: "Feminino", isNew: true },
  { slug: "moletom-canguru-cinza", name: "Moletom Canguru Cinza", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", basePrice: 279.9, category: "Masculino" },
  { slug: "saia-midi-cetim", name: "Saia Midi Cetim", imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80", basePrice: 259.9, discountPrice: 199.9, category: "Feminino" },
];

const SIZES = ["PP", "P", "M", "G", "GG"];
const COLORS = ["Preto", "Branco", "Bege", "Cinza", "Azul"];
const SORT_OPTIONS = [
  { value: "newest", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "discount", label: "Em promoção" },
];
// ───────────────────────────────────────────────────────────────────

export function ProductList() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryLabel =
    slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Todos";

  function toggleItem(item: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  return (
    <div className={styles.page}>
      <div className="container">

        {/* ── Breadcrumb / Title ── */}
        <div className={styles.pageHeader}>
          <span className={styles.breadcrumb}>Início / {categoryLabel}</span>
          <h1 className={styles.title}>{categoryLabel}</h1>
          <span className={styles.count}>{MOCK_PRODUCTS.length} peças</span>
        </div>

        <div className={styles.layout}>

          {/* ── Sidebar Filters ── */}
          <aside className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.filterGroup}>
              <h3 className={styles.filterLabel}>Tamanho</h3>
              <div className={styles.sizeGrid}>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`${styles.sizeBtn} ${selectedSizes.includes(s) ? styles.selected : ""}`}
                    onClick={() => toggleItem(s, selectedSizes, setSelectedSizes)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterLabel}>Cor</h3>
              <div className={styles.colorList}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    className={`${styles.colorBtn} ${selectedColors.includes(c) ? styles.selected : ""}`}
                    onClick={() => toggleItem(c, selectedColors, setSelectedColors)}
                  >
                    <span className={styles.colorDot} style={{ background: colorMap[c] }} />
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {(selectedSizes.length > 0 || selectedColors.length > 0) && (
              <button
                className={styles.clearBtn}
                onClick={() => { setSelectedSizes([]); setSelectedColors([]); }}
              >
                Limpar filtros
              </button>
            )}
          </aside>

          {/* ── Product Area ── */}
          <div className={styles.main}>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button
                className={styles.filterToggle}
                onClick={() => setFiltersOpen((v) => !v)}
              >
                Filtros {filtersOpen ? "−" : "+"}
              </button>

              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Ordenar por"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Grid */}
            <div className={styles.grid}>
              {MOCK_PRODUCTS.map((p) => (
                <ProductCard key={p.slug} {...p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const colorMap: Record<string, string> = {
  Preto: "#111",
  Branco: "#f5f5f5",
  Bege: "#c8a97e",
  Cinza: "#888",
  Azul: "#3b6ea5",
};