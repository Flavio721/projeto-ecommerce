
import express from "express";
import { getProductBySlug, listProducts } from "./products.controller.js";
import { searchLimiter } from "../configs/rateLimit.js";

const router = express.Router();

router.get("/products/:category/:size/:color",
    searchLimiter,
    listProducts
)
router.get("/products/:slug",
    searchLimiter,
    getProductBySlug
)

export default router;