import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from "../lib/AppError.js"

// ─── Helpers de token ─────────────────────────────────────────────

export function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
}

// ─── Funções do serviço ───────────────────────────────────────────

export async function register({ name, email, password, phone }) {
  // Checa se o e-mail já está em uso
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Nunca retornar o campo password para o cliente
  const user = await prisma.user.create({
    data: { name, email, password: passwordHash, phone },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Mesma mensagem para email e senha — não revelar qual está errado
  if (!user) {
    throw new AppError("E-mail ou senha inválidos", 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("E-mail ou senha inválidos", 401);
  }

  if (user.deletedAt) {
    throw new AppError("Conta desativada", 403);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Dados públicos do usuário — sem o password
  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return { user: publicUser, accessToken, refreshToken };
}

export async function refresh(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Refresh token não fornecido", 401);
  }

  // Verifica e decodifica o refreshToken
  // Se inválido ou expirado, jwt.verify lança erro que o errorMiddleware trata
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, role: true, deletedAt: true },
  });

  if (!user || user.deletedAt) {
    throw new AppError("Usuário não encontrado", 401);
  }

  const accessToken = generateAccessToken(user);

  return { accessToken };
}

