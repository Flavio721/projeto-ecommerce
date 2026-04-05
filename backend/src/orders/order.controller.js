import { PrismaClient } from "@prisma/client";
import { AppError } from "../lib/AppError.js";
import { calculateShipping } from "../utils/calculate.js";

const prisma = new PrismaClient();


export async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const { addressId, paymentMethod, couponCode } = req.body;

    // 1 — Busca o carrinho com todos os dados necessários
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError("Carrinho vazio", 400);
    }

    // 2 — Valida estoque de todos os itens antes de qualquer operação
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new AppError(
          `Estoque insuficiente para ${item.variant.product.name}`,
          400
        );
      }
    }

    // 3 — Calcula o subtotal
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant.product.discountPrice ?? item.variant.product.basePrice;
      return sum + price * item.quantity;
    }, 0);

    // 4 — Valida e aplica cupom se informado
    let discount = 0;
    let couponId = null;

    if (couponCode) {
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

      couponId = coupon.id;
      discount =
        coupon.discountType === "PERCENT"
          ? subtotal * (coupon.discountValue / 100)
          : coupon.discountValue;
    }

    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping - discount;

    // 5 — Cria o pedido numa transaction
    // Se qualquer operação falhar, tudo é desfeito automaticamente
    const order = await prisma.$transaction(async (tx) => {

      // Cria o Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          couponId,
          paymentMethod,
          subtotal,
          shipping,
          discount,
          total,
          // Cria os OrderItems já dentro do create
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.variant.product.discountPrice ?? item.variant.product.basePrice,
              productNameSnapshot: item.variant.product.name,
            })),
          },
        },
        include: { items: true },
      });

      // Decrementa o estoque de cada variante
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Incrementa o usedCount do cupom se houver
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Esvazia o carrinho
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req, res, next){
    try{
        const userId = req.user.id;

        const userIsAdmin = await prisma.user.findUnique({
            where: { id: parseInt(userId)}
        });

        if(!userIsAdmin || userIsAdmin.role !== "ADMIN"){
            throw new AppError("Não autorizado", 401);
        }

        const allOrders = await prisma.order.findMany()
        

        return res.status(200).json({
            orders: allOrders
        })
    }catch (error){
        next(error)
    }
}

export async function getOrder(req, res, next){
    try{
        const { orderId } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId)}
        });

        if(!order){
            throw new AppError("Pedido não encontrado", 404);
        }

        return res.status(200).json({
            order
        })
    }catch (error){
        next(error);
    }
}

export async function cancelOrder(req, res, next){
    try{
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await prisma.order.findUnique({
            where: { 
                id: parseInt(orderId),
                userId: parseInt(userId)
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
                role: "ADMIN"
            }
        })

        if(!order && !user){
            throw new AppError("Você não tem permissão para executar essa ação", 400);
        }

        if(order.status === "SHIPPED" || order.status === "DELIVERED"){
            throw new AppError("Você não pode mais cancelar o pedido", 400);
        }

        const cancelOrder = await prisma.order.delete({
            where: { id: order.id}
        });

        return res.status(200).json({
            message: "Pedido cancelado"
        })
    }catch (error){
        next(error)
    }
}