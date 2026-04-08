import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/layout/product/ProductCard";
import api from "../services/api";
import styles from "./ProductList.module.css";

// ─── Tipos ────────────────────────────────────────────────────────
interface ProductImage {
  url: string;
}

interface ProductCategory {
  name: string;
  slug: string;
}

interface Product {
  slug: string;
  name: string;
  images: ProductImage[];
  basePrice: number;
  discountPrice?: number;
  category: ProductCategory;
}

// ─── Constantes ───────────────────────────────────────────────────
const SIZES = ["PP", "P", "M", "G", "GG"];
const COLORS = ["Preto", "Branco", "Bege", "Cinza", "Azul"];
const SORT_OPTIONS = [
  { value: "newest",     label: "Mais recentes" },
  { value: "price_asc",  label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "discount",   label: "Em promoção" },
];
const colorMap: Record<string, string> = {
  Preto:  "#111",
  Branco: "#f5f5f5",
  Bege:   "#c8a97e",
  Cinza:  "#888",
  Azul:   "#3b6ea5",
};

export function ProductList() {
  const { slug } = useParams<{ slug: string }>();

  const [products, setProducts]             = useState<Product[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes]   = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy]                 = useState("newest");
  const [filtersOpen, setFiltersOpen]       = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const size  = selectedSizes.length  === 1 ? selectedSizes[0]  : "-";
        const color = selectedColors.length === 1 ? selectedColors[0] : "-";

        const { data } = await api.get(`/products/${slug}/${size}/${color}`);
        setProducts(data.products);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao buscar produtos";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProducts();
  }, [slug, selectedSizes, selectedColors]);

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.discountPrice ?? a.basePrice;
    const priceB = b.discountPrice ?? b.basePrice;

    if (sortBy === "price_asc")  return priceA - priceB;
    if (sortBy === "price_desc") return priceB - priceA;
    if (sortBy === "discount")
      return (b.discountPrice ? 1 : 0) - (a.discountPrice ? 1 : 0);
    return 0;
  });

  function toggleItem(
    item: string,
    list: string[],
    setList: (v: string[]) => void
  ) {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  }

  const categoryLabel = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Todos";

  return (
    <div className={styles.page}>
      <div className="container">

        <div className={styles.pageHeader}>
          <span className={styles.breadcrumb}>Início / {categoryLabel}</span>
          <h1 className={styles.title}>{categoryLabel}</h1>
          <span className={styles.count}>
            {loading ? "..." : `${sortedProducts.length} peças`}
          </span>
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
                    <span
                      className={styles.colorDot}
                      style={{ background: colorMap[c] }}
                    />
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
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {loading && (
              <div className={styles.feedback}>Carregando produtos...</div>
            )}

            {!loading && error && (
              <div className={styles.feedback}>{error}</div>
            )}

            {!loading && !error && sortedProducts.length === 0 && (
              <div className={styles.feedback}>
                Nenhum produto encontrado para os filtros selecionados.
              </div>
            )}

            {!loading && !error && sortedProducts.length > 0 && (
              <div className={styles.grid}>
                {sortedProducts.map((p) => (
                  <ProductCard
                    key={p.slug}
                    slug={p.slug}
                    name={p.name}
                    imageUrl={p.images?.[0]?.url ?? ""}
                    basePrice={p.basePrice}
                    discountPrice={p.discountPrice}
                    category={p.category?.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}