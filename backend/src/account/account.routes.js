import express from 'express';

const router = express.Router();

router.get("/me"
    // Obtém dados pessoais
)
router.patch("/update"
    // Atualiza dados pessoais
)
router.get("/addresses"
    // Lista endereços
)
router.post("/create"
    // Cria endereço
)
router.patch("/edit-address"
    // Edita endereço
)
router.delete("/delete-address"
    // Deleta endereço
)

export default router;