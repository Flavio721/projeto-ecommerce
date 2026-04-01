import express from 'express';

const router = express.Router();

router.get("/products"
    // Listagem com busca e paginação
)

router.post("/create-product"
    // Criar produto
)

router.patch("/product/:id"
    // Edita produto
)

router.delete("/delete/:id"
    // Deleta produto
)

export default router;