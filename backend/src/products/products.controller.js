import { PrismaClient } from "@prisma/client";
import { AppError } from "../lib/AppError.js";

const prisma = new PrismaClient();

export async function listProducts(req, res, next){
    try{
        const { category, size, color } = req.quey;

        const categorySelected = await prisma.category.findFirst({
            where: { slug: category }
        });

        if(!categorySelected){
            throw new AppError("Categoria não encontrada", 404);

        }

        const products = await prisma.product.findMany({
            where: {
                categoryId: categorySelected.id,
                active: true,
                deletedAt: null,
                // filtra por tamanho e cor nas variantes se informados
                ...(size || color
                ? {
                    variants: {
                        some: {
                        ...(size  && { size }),
                        ...(color && { color }),
                        stock: { gt: 0 },
                        },
                    },
                    }
                : {}),
            },
            include: {
                images: {
                orderBy: { position: "asc" },
                take: 1, // só a imagem principal na listagem
                },
            },
            });

        return res.status(200).json({ 
            products
        })
    }catch (error){
        next(error)
    }
}

export async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: { slug, active: true, deletedAt: null },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
        category: { select: { name: true, slug: true } },
      },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
}