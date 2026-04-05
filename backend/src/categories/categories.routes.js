import express from 'express';
import { getCategory, listCategorie } from './categories.controller.js';
import { searchLimiter } from '../configs/rateLimit.js';

const router = express.Router();

router.get("/",
    searchLimiter,
    listCategorie
)

router.get("/:slug",
    searchLimiter,
    getCategory
)

export default router;