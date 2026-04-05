import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.number().int().positive("Endereço inválido"),
  paymentMethod: z.enum(["credit_card", "pix", "boleto"], {
    errorMap: () => ({ message: "Método de pagamento inválido" }),
  }),
  couponCode: z.string().optional(),
});