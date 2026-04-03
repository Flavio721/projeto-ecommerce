// Importar validator
import { registerSchema, loginSchema } from "./auth.schema";
import * as authService from './auth.service.js';

// Configuração do cookie do refreshToken
// httpOnly → JavaScript da página não consegue ler (proteção XSS)
// sameSite → não enviado em requisições de outros sites (proteção CSRF)
// secure   → só enviado em HTTPS (ativado em produção)
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
};

export async function register(req, res, next) {
  try {
    const body = validate(registerSchema, req.body);
    const { user, accessToken, refreshToken } = await authService.register(body);

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(201).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const body = validate(loginSchema, req.body);
    const { user, accessToken, refreshToken } = await authService.login(body);

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    // O refreshToken vem do cookie — não do body
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await authService.refresh(refreshToken);

    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // Apaga o cookie — sem o refreshToken não é possível renovar o accessToken
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (err) {
    next(err);
  }
}
