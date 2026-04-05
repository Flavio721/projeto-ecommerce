import express from "express";
import { apiLimiter, searchLimiter } from "../configs/rateLimit.js";
import { cancelOrder, createOrder, getOrder, listOrders,  } from "./order.controller.js";

const router = express.Router()

router.post("/create",
    apiLimiter,
    createOrder
)
router.get("/",
    searchLimiter,
    listOrders
)
router.get("/:id",
    searchLimiter,
    getOrder
)
router.delete("/:id/cancel",
    apiLimiter,
    cancelOrder
)

export default router;