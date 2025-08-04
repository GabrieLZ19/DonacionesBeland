require("dotenv").config();

const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },

  // Configuración de Payphone
  payphone: {
    token: process.env.PAYPHONE_TOKEN,
    storeId: process.env.PAYPHONE_STORE_ID,
    apiUrl: "https://pay.payphonetodoesposible.com/api/Links",
    currency: "USD",
  },

  // Configuración de CORS
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3002",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3002",
    ],
    credentials: true,
  },

  // Configuración de donaciones
  donations: {
    minAmount: 1,
    maxAmount: 10000,
    currency: "USD",
    linkExpiration: 24, // horas
  },
};

// Validar configuraciones críticas
const validateConfig = () => {
  if (!config.payphone.token || !config.payphone.storeId) {
    throw new Error(
      "ERROR: PAYPHONE_TOKEN y PAYPHONE_STORE_ID deben estar configurados en el archivo .env"
    );
  }
};

module.exports = { config, validateConfig };
