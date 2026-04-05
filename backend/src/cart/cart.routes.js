import express from "express";
import { apiLimiter, searchLimiter } from "../configs/rateLimit.js";
import { addItem, getCart, removeItem, updateItem } from "./cart.controller.js";

const router = express.Router();

router.get("/",
    searchLimiter,
    getCart
)
router.post("/add-items",
    apiLimiter,
    addItem
)
router.patch("/items/:variantId",
    apiLimiter,
    updateItem
)
router.delete("/items/:variantId/cancel",
    apiLimiter,
    removeItem
)

export default router;