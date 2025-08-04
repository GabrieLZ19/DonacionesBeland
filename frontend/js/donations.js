// Configuración para el frontend (sin variables sensibles)
const DONATION_CONFIG = {
  apiUrl: "http://localhost:3001/api", // URL del backend
  currency: "USD",
  clientTransactionId: () => "B" + Date.now().toString().slice(-10), // Máximo 11 caracteres
};

// Función para procesar la donación
function processDonation() {
  const selectedAmount = document.getElementById("donationAmount").value;
  const customAmount = document.getElementById("customAmount").value;

  let amount = 0;

  if (customAmount && parseFloat(customAmount) > 0) {
    amount = parseFloat(customAmount);
  } else if (selectedAmount) {
    amount = parseFloat(selectedAmount);
  } else {
    Swal.fire({
      icon: "warning",
      title: "Cantidad requerida",
      text: "Por favor selecciona o ingresa una cantidad para donar.",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#f59e0b",
    });
    return;
  }

  if (amount < 1) {
    Swal.fire({
      icon: "warning",
      title: "Cantidad insuficiente",
      text: "La cantidad mínima de donación es $1 USD.",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#f59e0b",
    });
    return;
  }

  // Crear la transacción con Payphone
  createPayphoneTransaction(amount);
}

// Función para crear transacción con Payphone a través del backend
function createPayphoneTransaction(amount) {
  // Mostrar loading
  const button = document.getElementById("donateButton");
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="truncate">Procesando...</span>';
  button.disabled = true;

  // Configurar la transacción
  const transactionData = {
    amount: amount,
    description: `Donación de $${amount} USD para Beland - Sostenibilidad Ambiental`,
    clientTxId: DONATION_CONFIG.clientTransactionId(),
  };

  // Llamada al backend (seguro)
  fetch(`${DONATION_CONFIG.apiUrl}/create-payphone-transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  })
    .then((response) => {
      console.log(
        "Respuesta del servidor:",
        response.status,
        response.statusText
      );
      return response.json();
    })
    .then((data) => {
      console.log("Datos recibidos:", data);
      if (data.success && data.paymentUrl) {
        // Abrir página de pago en nueva ventana
        window.open(data.paymentUrl, "_blank");

        // Mostrar mensaje informativo con SweetAlert
        Swal.fire({
          icon: "success",
          title: "¡Redirigiendo a Payphone!",
          html: `
            <div class="text-center">
              <p class="mb-3">Se ha abierto la página de pago en una nueva ventana.</p>
              <p class="text-sm text-gray-600">Por favor completa tu donación de <strong>$${amount} USD</strong> en la ventana de Payphone.</p>
            </div>
          `,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#10b981",
          timer: 5000,
          timerProgressBar: true,
          allowOutsideClick: false,
        });

        // Restaurar botón después de abrir la ventana
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
        }, 2000);
      } else {
        console.error("Error en la respuesta:", data);
        throw new Error(data.message || "Error al procesar la donación");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error al procesar donación",
        text: "Hubo un error al procesar tu donación. Por favor intenta nuevamente.",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#ef4444",
      });

      // Restaurar botón
      button.innerHTML = originalText;
      button.disabled = false;
    });
}

// Función para scroll al formulario de donación
function scrollToDonation() {
  // Buscar por el texto "Dona Hoy"
  const headings = document.querySelectorAll("h2");
  let donationSection = null;

  for (let heading of headings) {
    if (heading.textContent.trim() === "Dona Hoy") {
      donationSection = heading;
      break;
    }
  }

  // Si no se encuentra el heading, buscar el formulario directamente
  if (!donationSection) {
    donationSection =
      document.getElementById("donationAmount") ||
      document.getElementById("customAmount") ||
      document.getElementById("donateButton");
  }

  if (donationSection) {
    donationSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Opcional: dar un pequeño focus al primer campo del formulario
    setTimeout(() => {
      const firstInput = document.getElementById("donationAmount");
      if (firstInput) {
        firstInput.focus();
      }
    }, 500);
  }
}

// Función para manejar respuesta de Payphone
function handlePayphoneResponse() {
  const urlParams = new URLSearchParams(window.location.search);

  // Verificar si hay parámetros de respuesta en la URL
  const status = urlParams.get("status");
  const transactionId = urlParams.get("clientTxId");
  const amount = urlParams.get("amount");

  if (status === "success") {
    // Mostrar mensaje de éxito con SweetAlert
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "¡Donación exitosa!",
        html: `
          <div class="text-center">
            <p class="mb-3">¡Gracias por tu generosa donación${
              amount ? " de $" + amount + " USD" : ""
            }!</p>
            <p class="text-sm text-gray-600">Tu transacción ha sido procesada exitosamente.</p>
            <p class="text-xs text-gray-500 mt-2">Tu apoyo ayuda a construir un futuro más sostenible.</p>
          </div>
        `,
        confirmButtonText: "Continuar",
        confirmButtonColor: "#10b981",
        allowOutsideClick: false,
        timer: 8000,
        timerProgressBar: true,
      });

      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);

    // Opcional: enviar evento de conversión para analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "donation_completed", {
        transaction_id: transactionId,
        currency: "USD",
        value: amount,
      });
    }
  } else if (status === "cancel") {
    setTimeout(() => {
      Swal.fire({
        icon: "info",
        title: "Donación cancelada",
        text: "La donación fue cancelada. Puedes intentar nuevamente cuando desees.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#6b7280",
      });
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  } else if (status === "error") {
    setTimeout(() => {
      Swal.fire({
        icon: "error",
        title: "Error en el pago",
        text: "Hubo un error procesando tu donación. Por favor contacta a soporte si el problema persiste.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#ef4444",
        footer:
          '<a href="mailto:soporte@beland.org" class="text-blue-500">Contactar soporte</a>',
      });
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  }
}

// Función para inicializar los event listeners
function initializeDonationForm() {
  // Limpiar campo personalizado cuando se selecciona cantidad predefinida
  const donationAmountSelect = document.getElementById("donationAmount");
  const customAmountInput = document.getElementById("customAmount");

  if (donationAmountSelect) {
    donationAmountSelect.addEventListener("change", function () {
      if (this.value && customAmountInput) {
        customAmountInput.value = "";
      }
    });
  }

  // Limpiar selector cuando se ingresa cantidad personalizada
  if (customAmountInput) {
    customAmountInput.addEventListener("input", function () {
      if (this.value && donationAmountSelect) {
        donationAmountSelect.value = "";
      }
    });
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  initializeDonationForm();
  handlePayphoneResponse();
});
