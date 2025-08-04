const express = require("express");
const donationRoutes = require("./donations");
const healthRoutes = require("./health");
const donationController = require("../controllers/donationController");
const { validateTransaction } = require("../middleware/validation");
const { rateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Rutas de la API
router.use("/donations", donationRoutes);
router.use("/health", healthRoutes);

// Ruta para compatibilidad con el frontend actual
router.post(
  "/create-payphone-transaction",
  rateLimiter,
  validateTransaction,
  donationController.createTransaction
);

module.exports = router;
