const payphoneService = require("../services/payphoneService");
const { generateClientTransactionId } = require("../utils/helpers");
const { config } = require("../config");

/**
 * Validar datos de transacción
 */
function validateTransactionData({ amount, clientTxId }) {
  if (!amount || amount < config.donations.minAmount) {
    return {
      isValid: false,
      message: `La cantidad debe ser mayor a $${config.donations.minAmount} USD`,
    };
  }

  if (amount > config.donations.maxAmount) {
    return {
      isValid: false,
      message: `La cantidad debe ser menor a $${config.donations.maxAmount} USD`,
    };
  }

  if (!clientTxId) {
    return {
      isValid: false,
      message: "ID de transacción del cliente es requerido",
    };
  }

  return { isValid: true };
}

class DonationController {
  /**
   * Crear transacción de donación
   */
  async createTransaction(req, res) {
    try {
      const { amount, description, clientTxId } = req.body;

      // Validar datos requeridos
      const validation = validateTransactionData({ amount, clientTxId });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }

      // Crear link de pago con Payphone
      const result = await payphoneService.createPaymentLink({
        amount,
        description,
        clientTxId,
      });

      res.json({
        success: true,
        paymentUrl: result.paymentUrl,
        transactionId: result.transactionId,
        message: "Link de pago creado exitosamente",
      });
    } catch (error) {
      console.error("Error al crear transacción:", error.message);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al procesar la donación",
        error: config.server.env === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Manejar webhook de Payphone
   */
  async handleWebhook(req, res) {
    try {
      console.log("Webhook recibido de Payphone:", req.body);

      const validation = payphoneService.validateWebhook(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Webhook inválido",
        });
      }

      // Aquí puedes procesar las notificaciones de Payphone
      // Por ejemplo, actualizar el estado de la donación en tu base de datos
      // await processDonationNotification(validation.data);

      res.status(200).json({
        received: true,
        message: "Webhook procesado exitosamente",
      });
    } catch (error) {
      console.error("Error procesando webhook:", error.message);
      res.status(500).json({
        success: false,
        message: "Error procesando webhook",
      });
    }
  }
}

/**
 * Procesar notificación de donación (para futuras implementaciones)
 */
async function processDonationNotification(data) {
  // Aquí puedes implementar la lógica para:
  // - Guardar en base de datos
  // - Enviar emails de confirmación
  // - Actualizar estadísticas
  // - Etc.
  console.log("Procesando notificación de donación:", data);
}

module.exports = new DonationController();
