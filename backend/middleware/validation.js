const { config } = require("../config");

/**
 * Middleware para validar datos de transacción
 */
const validateTransaction = (req, res, next) => {
  const { amount, clientTxId } = req.body;

  // Validar que existan los campos requeridos
  if (!amount) {
    return res.status(400).json({
      success: false,
      message: "El campo 'amount' es requerido",
    });
  }

  if (!clientTxId) {
    return res.status(400).json({
      success: false,
      message: "El campo 'clientTxId' es requerido",
    });
  }

  // Validar tipos de datos
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "El campo 'amount' debe ser un número positivo",
    });
  }

  // Validar rangos
  if (numericAmount < config.donations.minAmount) {
    return res.status(400).json({
      success: false,
      message: `La cantidad mínima es $${config.donations.minAmount} USD`,
    });
  }

  if (numericAmount > config.donations.maxAmount) {
    return res.status(400).json({
      success: false,
      message: `La cantidad máxima es $${config.donations.maxAmount} USD`,
    });
  }

  // Validar longitud del clientTxId
  if (typeof clientTxId !== "string" || clientTxId.length > 11) {
    return res.status(400).json({
      success: false,
      message: "El 'clientTxId' debe ser una cadena de máximo 11 caracteres",
    });
  }

  // Si todo está bien, continuar
  next();
};

/**
 * Middleware para validar datos de webhook
 */
const validateWebhook = (req, res, next) => {
  // Aquí puedes agregar validaciones específicas para webhooks
  // Por ejemplo, validar firmas, IPs permitidas, etc.

  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Datos de webhook requeridos",
    });
  }

  next();
};

module.exports = {
  validateTransaction,
  validateWebhook,
};
