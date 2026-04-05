import { z } from "zod";

export const updateMeSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  phone: z.string().optional(),
  // Para alterar senha, os dois campos são obrigatórios juntos
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres").optional(),
}).refine((data) => {
  // Se um dos campos de senha for informado, o outro também deve ser
  const hasCurrent = !!data.currentPassword;
  const hasNew = !!data.newPassword;
  return hasCurrent === hasNew;
}, {
  message: "Informe a senha atual e a nova senha",
  path: ["currentPassword"],
});

export const createAddressSchema = z.object({
  street: z.string().min(1, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres — ex: SP"),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();
// .partial() torna todos os campos opcionais — útil para PATCH