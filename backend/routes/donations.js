const express = require("express");
const donationController = require("../controllers/donationController");
const { validateTransaction } = require("../middleware/validation");
const { rateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Aplicar rate limiting a las rutas de donación
router.use(rateLimiter);

/**
 * @route POST /api/donations/create-transaction
 * @desc Crear transacción de donación con Payphone
 * @access Public
 */
router.post(
  "/create-transaction",
  validateTransaction,
  donationController.createTransaction
);

/**
 * @route POST /api/donations/webhook
 * @desc Webhook para notificaciones de Payphone
 * @access Public (pero debería tener validación de firma en producción)
 */
router.post("/webhook", donationController.handleWebhook);

module.exports = router;
