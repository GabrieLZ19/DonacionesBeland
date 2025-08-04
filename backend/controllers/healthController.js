const { config } = require("../config");

class HealthController {
  /**
   * Verificar salud del servidor
   */
  async checkHealth(req, res) {
    try {
      const healthData = {
        status: "OK",
        message: "Servidor de donaciones Beland funcionando correctamente",
        timestamp: new Date().toISOString(),
        environment: config.server.env,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || "1.0.0",
      };

      res.json(healthData);
    } catch (error) {
      console.error("Error en health check:", error.message);
      res.status(500).json({
        status: "ERROR",
        message: "Error en el servidor",
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Verificar configuración del sistema
   */
  async checkConfig(req, res) {
    try {
      const configStatus = {
        payphone: {
          configured: !!(config.payphone.token && config.payphone.storeId),
          apiUrl: config.payphone.apiUrl,
          currency: config.payphone.currency,
        },
        server: {
          port: config.server.port,
          environment: config.server.env,
          frontendUrl: config.server.frontendUrl,
        },
        donations: {
          minAmount: config.donations.minAmount,
          maxAmount: config.donations.maxAmount,
          currency: config.donations.currency,
          linkExpiration: config.donations.linkExpiration,
        },
      };

      res.json({
        status: "OK",
        message: "Configuración del sistema",
        config: configStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error verificando configuración:", error.message);
      res.status(500).json({
        status: "ERROR",
        message: "Error verificando configuración",
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = new HealthController();
