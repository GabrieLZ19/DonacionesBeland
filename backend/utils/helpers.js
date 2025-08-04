/**
 * Generar ID único para transacciones de cliente
 * @returns {string} ID de transacción único
 */
const generateClientTransactionId = () => {
  const prefix = "B"; // Beland
  const timestamp = Date.now().toString().slice(-10); // Últimos 10 dígitos del timestamp
  return prefix + timestamp; // Máximo 11 caracteres
};

/**
 * Formatear cantidad de dinero
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Moneda (por defecto USD)
 * @returns {string} Cantidad formateada
 */
const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizar string para logs
 * @param {string} str - String a sanitizar
 * @returns {string} String sanitizado
 */
const sanitizeForLog = (str) => {
  if (typeof str !== "string") return str;

  // Remover información sensible
  return str
    .replace(/password/gi, "***")
    .replace(/token/gi, "***")
    .replace(/key/gi, "***")
    .replace(/secret/gi, "***");
};

/**
 * Crear delay asíncrono
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del delay
 */
const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Validar que un objeto tenga las propiedades requeridas
 * @param {Object} obj - Objeto a validar
 * @param {Array} requiredFields - Campos requeridos
 * @returns {Object} Resultado de la validación
 */
const validateRequiredFields = (obj, requiredFields) => {
  const missingFields = requiredFields.filter(
    (field) =>
      obj[field] === undefined || obj[field] === null || obj[field] === ""
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
    message:
      missingFields.length > 0
        ? `Campos requeridos faltantes: ${missingFields.join(", ")}`
        : "Validación exitosa",
  };
};

module.exports = {
  generateClientTransactionId,
  formatCurrency,
  isValidEmail,
  sanitizeForLog,
  delay,
  validateRequiredFields,
};
