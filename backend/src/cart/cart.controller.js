import { PrismaClient } from "@prisma/client";
import { AppError } from "../lib/AppError.js";

const prisma = new PrismaClient();

export async function getCart(req, res, next){
    try{
        const userId = req.user.id;

        const userExisting = await prisma.user.findUnique({
            where: { id: parseInt(userId)}
        });

        if(!userExisting){
            throw new AppError("Usuário não encontrado", 404);
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: userExisting.id},
        });

        if(!cart){
            throw new AppError("Carrinho não encontrado", 404);
        }

        const cartItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id }
        });
        return res.status(200).json({
            cartItems
        })
    }catch (error){
        next(error);
    }
}

export async function addItem(req, res, next){
    try{
        const { variantId, quantity } = req.body;
        const userId = req.user.id;

        const userExisting = await prisma.user.findUnique({
            where: { 
                id: parseInt(userId)
            }
        });

        if(!userExisting){
            throw new AppError("Usuário não encontrado", 404);
        }

        const variantExisting = await prisma.productVariant.findUnique({
            where: { id: parseInt(variantId)}
        });

        if(!variantExisting){
            throw new AppError("Produto não encontrado", 404);
        }

        if(variantExisting.stock < quantity){
            throw new AppError("Quantidade insuficiente", 400);
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: parseInt(userId)}
        });

        const newCartItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                variantId: parseInt(variantId),
                quantity: parseInt(quantity)
            }
        });

        return res.status(201).json({
            message: "Item registrado com sucesso"
        });
    }catch (error){
        next(error);
    }
}

export async function updateItem(req, res, next) {
  try {
    const userId    = req.user.id;
    const variantId = Number(req.params.variantId);
    const { quantity } = req.body;

    // 1 — Busca o carrinho do usuário
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) throw new AppError("Carrinho não encontrado", 404);

    // 2 — Verifica se o item existe no carrinho
    const cartItem = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } }
    });

    if (!cartItem) throw new AppError("Item não encontrado no carrinho", 404);

    // 3 — Verifica se tem estoque suficiente para a nova quantidade
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId }
    });

    if (variant.stock < quantity) {
      throw new AppError("Estoque insuficiente", 400);
    }

    // 4 — Se quantity for 0, remove o item em vez de atualizar
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { cartId_variantId: { cartId: cart.id, variantId } }
      });

      return res.status(200).json({ message: "Item removido do carrinho" });
    }

    // 5 — Atualiza a quantidade
    const updated = await prisma.cartItem.update({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
      data: { quantity }
    });

    return res.status(200).json({ cartItem: updated });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next){
    try{
        const { variantId } = req.body;
        const userId = req.user.id;


        const cart = await prisma.cart.findUnique({
            where: { userId: parseInt(userId)}
        });


        if(!cart){
            throw new AppError("Usuário não encontrado", 404);
        }

        const cartId = cart.id;
        const cartItemExisting = await prisma.cartItem.findUnique({
            where: { cartId_variantId: { cartId, variantId}}
        })

        if(!cartItemExisting){
            throw new AppError("Item não registrado no carrinho", 404);
        }

        const removeItem = await prisma.cartItem.delete({
            where: { id: cartItemExisting.id}
        })

        return res.status(200).json({
            message: "Item removido com sucesso"
        });
    }catch (error){
        next(error)
    }
}