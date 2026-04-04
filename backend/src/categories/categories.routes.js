import express from 'express';
import rateLimit from 'express-rate-limit';
import { getCategory, listCategorie } from './categories.controller';

const router = express.Router();

const searchRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
    message: { error: "Muitas buscas. Tente novamente em 1 minuto" },
    standardHeaders: true,
    legacyHeaders: false
});

router.get("/",
    searchRateLimit,
    listCategorie
)

router.get("/:slug",
    searchRateLimit,
    getCategory
)

export default router;