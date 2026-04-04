import { PrismaClient } from "@prisma/client";
import { AppError } from "../lib/AppError.js";

const prisma = new PrismaClient();

export async function listCategorie(req, res, next) {
    try{

        const categories = await prisma.category.findMany({
            where: {
                active: true,
                parentId: null,
            },
            include: {
                children: {
                where: { active: true },
                },
            },
        });

        if(!categories.length){
            throw new AppError("Nenhuma categoria encontrada", 404);
        }
        return res.status(200).json({
            categories
        })
    }catch (error){
        next(error);
    }
}
export async function getCategory(req, res, next){
    try{
        const { slug } = req.params;

        const categorie = await prisma.category.findFirst({
            where: { slug: slug }
        });

        if(!categorie){
            throw new AppError("Categoria não encontrada", 404);
        }

        return res.status(200).json({
            categorie
        })
    }catch (error){
        next(error);
    }
}