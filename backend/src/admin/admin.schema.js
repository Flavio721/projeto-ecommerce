import { z } from "zod";

// ─── Variante ─────────────────────────────────────────────────────

const variantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  sku: z.string().min(1, "SKU obrigatório"),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  additionalPrice: z.number().min(0).optional().default(0),
});

// ─── Produto ──────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  slug: z.string().min(1, "Slug obrigatório")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido — use apenas letras minúsculas, números e hífens"),
  description: z.string().min(1, "Descrição obrigatória"),
  categoryId: z.number().int().positive("Categoria inválida"),
  basePrice: z.number().positive("Preço deve ser maior que zero"),
  discountPrice: z.number().positive().optional(),
  active: z.boolean().optional().default(true),
  // Pelo menos uma variante é obrigatória
  variants: z.array(variantSchema).min(1, "Informe pelo menos uma variante"),
}).refine((data) => {
  // Preço promocional não pode ser maior que o preço base
  if (data.discountPrice && data.discountPrice >= data.basePrice) {
    return false;
  }
  return true;
}, {
  message: "Preço promocional deve ser menor que o preço base",
  path: ["discountPrice"],
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  categoryId: z.number().int().positive().optional(),
  basePrice: z.number().positive().optional(),
  discountPrice: z.number().positive().optional().nullable(),
  active: z.boolean().optional(),
});

// ─── Pedidos ──────────────────────────────────────────────────────

export const updateOrderStatusSchema = z.object({
  status: z.enum(
    ["PENDING", "PAYMENT_CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"],
    { errorMap: () => ({ message: "Status inválido" }) }
  ),
});

// ─── Categorias ───────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  slug: z.string().min(1, "Slug obrigatório")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  parentId: z.number().int().positive().optional(),
  imageUrl: z.string().url("URL inválida").optional(),
  active: z.boolean().optional().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Cupons ───────────────────────────────────────────────────────

export const createCouponSchema = z.object({
  code: z.string().min(1, "Código obrigatório").toUpperCase(),
  discountType: z.enum(["PERCENT", "FIXED"], {
    errorMap: () => ({ message: "Tipo de desconto inválido" }),
  }),
  discountValue: z.number().positive("Valor do desconto deve ser maior que zero"),
  minOrderValue: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().datetime({ message: "Data inválida" }).optional(),
  active: z.boolean().optional().default(true),
}).refine((data) => {
  // Desconto percentual não pode ser maior que 100%
  if (data.discountType === "PERCENT" && data.discountValue > 100) {
    return false;
  }
  return true;
}, {
  message: "Desconto percentual não pode ser maior que 100%",
  path: ["discountValue"],
});

export const updateCouponSchema = createCouponSchema.partial();