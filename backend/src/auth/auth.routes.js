import express from 'express';
import { register, login, refresh, logout } from './auth.controller.js';
import { loginLimiter, registerLimiter } from '../configs/rateLimit.js';

const router = express.Router();


router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;