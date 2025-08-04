const express = require("express");
const healthController = require("../controllers/healthController");

const router = express.Router();

/**
 * @route GET /api/health
 * @desc Verificar salud del servidor
 * @access Public
 */
router.get("/", healthController.checkHealth);

/**
 * @route GET /api/health/config
 * @desc Verificar configuración del sistema
 * @access Public (pero debería ser privado en producción)
 */
router.get("/config", healthController.checkConfig);

module.exports = router;
