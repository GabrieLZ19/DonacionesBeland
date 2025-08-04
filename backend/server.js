const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Importar configuración y validar
const { config, validateConfig } = require("./config");
const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const logger = require("./utils/logger");

// Validar configuración antes de iniciar
try {
  validateConfig();
  logger.info("Configuración validada exitosamente");
} catch (error) {
  logger.error("Error en la configuración:", error);
  process.exit(1);
}

// Crear aplicación Express
const app = express();

// Trust proxy para herramientas como Heroku, Railway, etc.
app.set("trust proxy", 1);

// Middleware de seguridad
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configurado desde el archivo de configuración
app.use(cors(config.cors));

// Logging de requests
app.use(morgan(config.server.env === "development" ? "dev" : "combined"));

// Parsear JSON
app.use(
  express.json({
    limit: "10mb",
    type: "application/json",
  })
);

// Parsear URL encoded
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Log de requests entrantes en desarrollo
if (config.server.env === "development") {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`, {
      body: req.body,
      query: req.query,
      headers: {
        "content-type": req.headers["content-type"],
        "user-agent": req.headers["user-agent"],
      },
    });
    next();
  });
}

// Rutas principales de la API
app.use("/api", routes);

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    message: "🌱 API de Donaciones Beland",
    description: "Sistema de donaciones para sostenibilidad ambiental",
    version: "2.0.0",
    environment: config.server.env,
    endpoints: {
      health: "/api/health",
      donations: "/api/donations",
      documentation: "/api/health/config",
    },
    timestamp: new Date().toISOString(),
  });
});

// Middleware para rutas no encontradas
app.use("*", notFoundHandler);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de errores no capturados
process.on("uncaughtException", (error) => {
  logger.error("Excepción no capturada:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Promise rechazada no manejada:", reason);
  // En producción, podrías querer cerrar el servidor gracefully
  if (config.server.env === "production") {
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM recibido, cerrando servidor...");
  server.close(() => {
    logger.info("Servidor cerrado exitosamente");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT recibido, cerrando servidor...");
  server.close(() => {
    logger.info("Servidor cerrado exitosamente");
    process.exit(0);
  });
});

// Iniciar servidor
const server = app.listen(config.server.port, () => {
  logger.info(`🚀 Servidor backend corriendo en puerto ${config.server.port}`);
  logger.info(`📊 Ambiente: ${config.server.env}`);
  logger.info(`🌐 CORS configurado para: ${config.cors.origin.join(", ")}`);
  logger.info(
    `💰 Payphone configurado: ${!!(
      config.payphone.token && config.payphone.storeId
    )}`
  );

  if (config.server.env === "development") {
    logger.info("🔧 Endpoints disponibles:");
    logger.info("   GET  / - Información general");
    logger.info("   GET  /api/health - Estado del servidor");
    logger.info("   GET  /api/health/config - Configuración del sistema");
    logger.info("   POST /api/donations/create-transaction - Crear donación");
    logger.info("   POST /api/donations/webhook - Webhook de Payphone");
    logger.info(
      "   POST /api/create-payphone-transaction - Compatibilidad legacy"
    );
  }
});

module.exports = app;
