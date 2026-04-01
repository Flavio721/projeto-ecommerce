import express from "express";

const router = express.Router();

router.get("/"
    // Função e middlewares do get de carrinho
)
router.post("/items"
    // Função e middlewares do post do carrinho
)
router.patch("/items/:variantId"
    // Função e middlewares do patch do carrinho
)
router.delete("/items/:variantId/cancel"
    // Função e middlewares do patch do carrinho
)

export default router;