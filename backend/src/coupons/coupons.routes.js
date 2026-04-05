import express from 'express';
import { searchLimiter } from '../configs/rateLimit.js';
import { checkCoupon } from './coupons.controller.js';

const router = express.Router();


router.post("/create"
    // Funções e middlewares para criar cupom
)
router.post("/validate",
    searchLimiter,
    checkCoupon
)

export default router;