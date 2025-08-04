const { config } = require("../config");

/**
 * Middleware para manejar rutas no encontradas
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    availableRoutes: {
      donations: {
        "POST /api/donations/create-transaction":
          "Crear transacción de donación",
        "POST /api/donations/webhook": "Webhook de Payphone",
      },
      health: {
        "GET /api/health": "Estado del servidor",
        "GET /api/health/config": "Configuración del sistema",
      },
      legacy: {
        "POST /api/create-payphone-transaction":
          "Compatibilidad con frontend anterior",
      },
    },
  });
};

/**
 * Middleware para manejar errores generales
 */
const errorHandler = (error, req, res, next) => {
  console.error("Error no manejado:", {
    message: error.message,
    stack: config.server.env === "development" ? error.stack : undefined,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  // Errores de validación de Mongoose (si usas MongoDB en el futuro)
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      details: Object.values(error.errors).map((err) => err.message),
    });
  }

  // Errores de duplicación (si usas base de datos)
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Recurso duplicado",
    });
  }

  // Error por defecto
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Error interno del servidor",
    error: config.server.env === "development" ? error.message : undefined,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
