import { useState } from "react";
import { Button } from "../../components/layout/ui/Button";
import styles from "./Admin.module.css";

const MOCK_PRODUCTS = [
  { id: 1, name: "Jaqueta Couro Sintético", category: "Masculino", price: 479.9,  stock: 14, active: true  },
  { id: 2, name: "Calça Wide Leg Bege",     category: "Feminino",  price: 349.9,  stock: 8,  active: true  },
  { id: 3, name: "Camiseta Oversized Preta",category: "Feminino",  price: 139.9,  stock: 0,  active: true  },
  { id: 4, name: "Vestido Midi Floral",      category: "Feminino",  price: 429.9,  stock: 5,  active: false },
];

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AdminProducts() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Produtos</h1>
        <Button size="sm">+ Novo produto</Button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th className={styles.textRight}>Preço</th>
              <th className={styles.textRight}>Estoque</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className={styles.productName}>{p.name}</td>
                <td className={styles.muted}>{p.category}</td>
                <td className={styles.textRight}>{formatBRL(p.price)}</td>
                <td className={`${styles.textRight} ${p.stock === 0 ? styles.outOfStock : ""}`}>
                  {p.stock === 0 ? "Esgotado" : p.stock}
                </td>
                <td>
                  <span className={`${styles.pill} ${p.active ? styles.pillActive : styles.pillInactive}`}>
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button className={styles.actionLink}>Editar</button>
                  <button className={`${styles.actionLink} ${styles.actionDanger}`}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}