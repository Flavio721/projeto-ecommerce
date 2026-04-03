import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout } from './auth.controller';

const router = express.Router();

// Rate limit específico para login — máximo 10 tentativas por IP a cada 15 minutos
// Evita ataques de força bruta na rota mais sensível
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { error: "Muitas tentativas. Tente novamente em 15 minutos" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", register);
router.post("/login", loginRateLimit, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;