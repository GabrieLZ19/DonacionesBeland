const axios = require("axios");
const { config } = require("../config");

class PayphoneService {
  constructor() {
    this.apiUrl = config.payphone.apiUrl;
    this.token = config.payphone.token;
    this.storeId = config.payphone.storeId;
    this.currency = config.payphone.currency;
  }

  /**
   * Crear un link de pago con Payphone
   * @param {Object} transactionData - Datos de la transacción
   * @returns {Promise<string>} - URL del link de pago
   */
  async createPaymentLink(transactionData) {
    try {
      const { amount, clientTxId, description } = transactionData;

      // Convertir a centavos (Payphone requiere montos en centavos)
      const amountInCents = Math.round(parseFloat(amount) * 100);

      const payphoneData = {
        amount: amountInCents,
        amountWithoutTax: amountInCents, // Todo el monto sin impuesto para donaciones
        tax: 0,
        currency: this.currency,
        clientTransactionId: clientTxId,
        storeId: this.storeId,
        reference: `Donacion Beland $${amount}`,
        oneTime: true, // El link se puede usar solo una vez
        expireIn: config.donations.linkExpiration, // El link expira en 24 horas
      };

      console.log("Creando link de pago con Payphone:", {
        amount: `$${amount} USD (${amountInCents} centavos)`,
        clientTransactionId: payphoneData.clientTransactionId,
        reference: payphoneData.reference,
        storeId: payphoneData.storeId,
      });

      const response = await axios.post(this.apiUrl, payphoneData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });

      // Validar respuesta de Payphone
      if (
        typeof response.data === "string" &&
        response.data.includes("payp.page.link")
      ) {
        return {
          success: true,
          paymentUrl: response.data,
          transactionId: clientTxId,
        };
      } else {
        throw new Error(`Respuesta inesperada de Payphone: ${response.data}`);
      }
    } catch (error) {
      console.error(
        "Error en PayphoneService:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Error al crear el link de pago con Payphone"
      );
    }
  }

  /**
   * Validar webhook de Payphone
   * @param {Object} webhookData - Datos del webhook
   * @returns {Object} - Datos validados
   */
  validateWebhook(webhookData) {
    // Aquí puedes agregar validaciones específicas del webhook
    console.log("Validando webhook de Payphone:", webhookData);

    return {
      isValid: true,
      data: webhookData,
    };
  }
}

module.exports = new PayphoneService();
