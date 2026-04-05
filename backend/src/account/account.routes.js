import express from 'express';
import { apiLimiter, searchLimiter } from '../configs/rateLimit.js';
import { createAddress, deleteAddress, getAllAddress, me, update, updateAddress } from './account.controller.js';

const router = express.Router();

router.get("/me",
    searchLimiter,
    me
)
router.patch("/update/",
    apiLimiter,
    update
)
router.get("/addresses",
    searchLimiter,
    getAllAddress
)
router.post("/create",
    apiLimiter,
    createAddress
)
router.patch("/update",
    apiLimiterl,
    updateAddress
)
router.delete("/delete/:addressId",
    apiLimiter,
    deleteAddress
)

export default router;