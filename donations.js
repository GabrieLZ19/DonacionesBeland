// Configuración de Payphone
const PAYPHONE_CONFIG = {
  token:
    "m7eNYDkQ1ErfgjK6LR1a3o4m3IhZgJwh8fDoYz-IYRHHazDEMmZ7JyJjbFCMMa2kgvPK4JLtZGabo_knVVctxUOks4wZS46SU_sb9XdwGBvowCTG-KWEUerLyV0pkEpD6etcZQ3snyalDzAJLNjGW6cWiyc3QkgswrKIydPIxnpMlu6g0ZZlc56x89iEf3_vSf7lzub9g2SHSZLsXxrOayN5Nlocsbk8wJVI2vk1PCXC2Tciqfq5OB3krQhbTm-OMOZIbEIBhHOltpzQbAwWaC_0HCq9do_tWMRJyebp--OPKnrw21GzUO0F7V63jtarC6kDqVXVgdMHe1PzgT-NOgHfjWs",
  storeId: "TU_STORE_ID_AQUI", // Necesitas el Store ID de tu cuenta Payphone
  apiUrl: "https://pay.payphone.app/api/button",
  currency: "USD",
  clientTransactionId: () => "BELAND_" + Date.now(),
  responseUrl: window.location.origin + "#donation-success",
  cancelUrl: window.location.origin + "#donation-cancel",
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
    alert("Por favor selecciona o ingresa una cantidad para donar.");
    return;
  }

  if (amount < 1) {
    alert("La cantidad mínima de donación es $1 USD.");
    return;
  }

  // Crear la transacción con Payphone
  createPayphoneTransaction(amount);
}

// Función para crear transacción con Payphone
function createPayphoneTransaction(amount) {
  // Mostrar loading
  const button = document.getElementById("donateButton");
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="truncate">Procesando...</span>';
  button.disabled = true;

  // Configurar la transacción para Payphone
  const transactionData = {
    id: PAYPHONE_CONFIG.storeId,
    clientTxId: PAYPHONE_CONFIG.clientTransactionId(),
    amount: amount,
    tax: 0,
    currency: PAYPHONE_CONFIG.currency,
    description: `Donación de $${amount} USD para Beland - Sostenibilidad Ambiental`,
    responseUrl: PAYPHONE_CONFIG.responseUrl,
    cancelUrl: PAYPHONE_CONFIG.cancelUrl,
    lang: "es",
  };

  // Llamada directa a la API de Payphone
  fetch(PAYPHONE_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PAYPHONE_CONFIG.token}`,
    },
    body: JSON.stringify(transactionData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.payWithCard) {
        // Redirigir a la página de pago de Payphone
        window.open(data.payWithCard, "_blank");

        // Restaurar botón después de abrir la ventana
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
        }, 2000);
      } else {
        throw new Error(data.message || "Error al procesar la donación");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        "Hubo un error al procesar tu donación. Por favor intenta nuevamente."
      );

      // Restaurar botón
      button.innerHTML = originalText;
      button.disabled = false;
    });
}

// Función para scroll al formulario de donación
function scrollToDonation() {
  const donationSection = document.querySelector('h2:contains("Dona Hoy")');

  if (!donationSection) {
    // Fallback: buscar por el texto "Dona Hoy"
    const headings = document.querySelectorAll("h2");
    for (let heading of headings) {
      if (heading.textContent.trim() === "Dona Hoy") {
        heading.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  } else {
    donationSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Función para manejar respuesta de Payphone
function handlePayphoneResponse() {
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(window.location.search);

  // Verificar si hay parámetros de respuesta en la URL
  const status = urlParams.get("status") || urlParams.get("Status");
  const transactionId =
    urlParams.get("id") || urlParams.get("Id") || urlParams.get("clientTxId");
  const amount = urlParams.get("amount") || urlParams.get("Amount");

  if (
    hash === "#donation-success" ||
    status === "success" ||
    status === "Success"
  ) {
    // Mostrar mensaje de éxito
    setTimeout(() => {
      alert(
        `¡Gracias por tu donación${
          amount ? " de $" + amount + " USD" : ""
        }! Tu transacción ha sido procesada exitosamente.`
      );

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
  } else if (
    hash === "#donation-cancel" ||
    status === "cancel" ||
    status === "Cancel"
  ) {
    setTimeout(() => {
      alert("La donación fue cancelada.");
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  } else if (status === "error" || status === "Error") {
    setTimeout(() => {
      alert(
        "Hubo un error procesando tu donación. Por favor contacta a soporte si el problema persiste."
      );
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
