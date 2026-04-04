
import express from "express";
import { getProductBySlug, listProducts } from "./products.controller";
import rateLimit from "express-rate-limit";

const router = express.Router();

const searchRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
    message: { error: "Muitas buscas. Tente novamente em 1 minuto" },
    standardHeaders: true,
    legacyHeaders: false
});
router.get("/products/:category/:size/:color",
    searchRateLimit,
    listProducts
)
router.get("/products/:slug",
    searchRateLimit,
    getProductBySlug
)

export default router;