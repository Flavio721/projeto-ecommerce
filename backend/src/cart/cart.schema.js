import { z } from "zod";

export const addItemSchema = z.object({
  variantId: z.number().int().positive("variantId inválido"),
  quantity: z.number().int().min(1, "Quantidade mínima é 1"),
});

export const updateItemSchema = z.object({
  quantity: z.number().int().min(0, "Quantidade inválida"),
  // min 0 pois quantity 0 remove o item do carrinho
});