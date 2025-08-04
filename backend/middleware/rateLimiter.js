const rateLimit = require("express-rate-limit");
const { config } = require("../config");

/**
 * Rate limiter para donaciones
 * Previene spam y ataques
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: config.server.env === "development" ? 100 : 10, // Límite de requests por ventana de tiempo
  message: {
    success: false,
    message:
      "Demasiadas solicitudes desde esta IP, intenta nuevamente en 15 minutos.",
  },
  standardHeaders: true, // Retorna info del rate limit en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
  skip: (req) => {
    // Omitir rate limiting para health checks
    return req.path.includes("/health");
  },
});

/**
 * Rate limiter más estricto para webhooks
 */
const webhookRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // Máximo 30 webhooks por minuto
  message: {
    success: false,
    message: "Demasiados webhooks recibidos",
  },
});

module.exports = {
  rateLimiter,
  webhookRateLimiter,
};
