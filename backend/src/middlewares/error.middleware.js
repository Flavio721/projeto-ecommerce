import { AppError } from "../lib/AppError.js";

export const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!statusCode) statusCode = 500;
  if (!message) message = "Erro! Tente novamente mais tarde";

  // Erros do Prisma
  if (err.code === "P2002") {
    statusCode = 409;
    message = "Registro já existe";
  }
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Registro não encontrado";
  }
  if (err.code === "P2003") {
    statusCode = 400;
    message = "Referência inválida";
  }

  // Erros do JWT
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expirado";
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token inválido";
  }

  // Erros do Multer
  if (err.name === "MulterError") {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Arquivo muito grande"
        : "Erro no envio do arquivo";
  }

  // Log — stack só em desenvolvimento
  console.error("Erro:", {
    message: err.message,
    statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // ← isso estava faltando
  res.status(statusCode).json({
    error: message,
    // detalhes dos campos só para erros de validação
    ...(err.fields && { fields: err.fields }),
    // stack só em desenvolvimento
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

