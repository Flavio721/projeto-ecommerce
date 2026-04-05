import { prisma } from "./prisma.js";
import { AppError } from "./AppError.js";

/**
 * Valida um cupom e calcula o desconto.
 * Reutilizada no controller de cupons e no createOrder.
 *
 * @param {string} couponCode - código do cupom
 * @param {number} subtotal   - valor do pedido para checar minOrderValue
 * @returns {{ coupon, discount }} - cupom encontrado e valor do desconto
 */
export async function validateCoupon(couponCode, subtotal) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: couponCode },
  });

  if (!coupon || !coupon.active) {
    throw new AppError("Cupom inválido", 400);
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new AppError("Cupom expirado", 400);
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new AppError("Cupom esgotado", 400);
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    throw new AppError(
      `Pedido mínimo de R$${coupon.minOrderValue} para este cupom`,
      400
    );
  }

  const discount =
    coupon.discountType === "PERCENT"
      ? subtotal * (coupon.discountValue / 100)
      : coupon.discountValue;

  return { coupon, discount };
}