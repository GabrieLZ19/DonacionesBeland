const { config } = require("../config");
const { sanitizeForLog } = require("./helpers");

/**
 * Logger personalizado para la aplicación
 */
class Logger {
  constructor() {
    this.isDevelopment = config.server.env === "development";
  }

  /**
   * Log de información
   */
  info(message, data = null) {
    const logData = {
      level: "INFO",
      message,
      timestamp: new Date().toISOString(),
      data: data ? this.sanitizeData(data) : null,
    };

    if (this.isDevelopment) {
      console.log("ℹ️ ", message, data || "");
    } else {
      console.log(JSON.stringify(logData));
    }
  }

  /**
   * Log de error
   */
  error(message, error = null) {
    const logData = {
      level: "ERROR",
      message,
      timestamp: new Date().toISOString(),
      error: error
        ? {
            message: error.message,
            stack: this.isDevelopment ? error.stack : undefined,
          }
        : null,
    };

    if (this.isDevelopment) {
      console.error("❌ ", message, error || "");
    } else {
      console.error(JSON.stringify(logData));
    }
  }

  /**
   * Log de advertencia
   */
  warn(message, data = null) {
    const logData = {
      level: "WARN",
      message,
      timestamp: new Date().toISOString(),
      data: data ? this.sanitizeData(data) : null,
    };

    if (this.isDevelopment) {
      console.warn("⚠️ ", message, data || "");
    } else {
      console.warn(JSON.stringify(logData));
    }
  }

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message, data = null) {
    if (this.isDevelopment) {
      console.debug("🐛 ", message, data || "");
    }
  }

  /**
   * Log de transacción de donación
   */
  donation(action, data) {
    const logData = {
      level: "DONATION",
      action,
      timestamp: new Date().toISOString(),
      data: this.sanitizeData(data),
    };

    if (this.isDevelopment) {
      console.log("💰 DONATION:", action, data);
    } else {
      console.log(JSON.stringify(logData));
    }
  }

  /**
   * Sanitizar datos sensibles para logs
   */
  sanitizeData(data) {
    if (!data) return null;

    const sanitized = JSON.parse(JSON.stringify(data));

    // Campos a ocultar
    const sensitiveFields = [
      "token",
      "password",
      "key",
      "secret",
      "authorization",
    ];

    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (
          sensitiveFields.some((field) => key.toLowerCase().includes(field))
        ) {
          obj[key] = "***";
        } else if (typeof obj[key] === "string") {
          obj[key] = sanitizeForLog(obj[key]);
        }
      }
    };

    if (typeof sanitized === "object") {
      sanitizeObject(sanitized);
    }

    return sanitized;
  }
}

module.exports = new Logger();
