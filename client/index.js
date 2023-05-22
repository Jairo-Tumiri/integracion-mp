// Add SDK credentials
// REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
const mercadopago = new MercadoPago("TEST-dafb5820-ae1c-46db-8866-5c5c2ba41c86", {
  locale: "es-AR", // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

// Handle call to backend and generate preference.
document.getElementById("checkout-btn").addEventListener("click", function () {
  // El producto
  const orderData = {
    quantity: document.getElementById("quantity").innerHTML,
    description: document.getElementById("product-description").innerHTML,
    price: document.getElementById("unit-price").innerHTML,
  };

  // Peticion fetch a la ruta de prefencia (como llama al producto)

  fetch("http://localhost:8080/create_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (preference) {
      createCheckoutButton(preference.id);
    })
    .catch(function () {
      alert("Unexpected error");
    });
});

// prefencia === producto enviado/seleccionado


function createCheckoutButton(preferenceId) {
    // Initialize the checkout
    const bricksBuilder = mercadopago.bricks();
    //bricks genera la integracion del formulario y la interaccion con el usuario
    const renderComponent = async (bricksBuilder) => {
      if (window.checkoutButton) window.checkoutButton.unmount(); //para no generar doble compra
      await bricksBuilder.create(
        'wallet',
        'button-checkout', // class/id where the payment button will be displayed
        {
          initialization: {
            preferenceId: preferenceId
          },
          callbacks: {
            onError: (error) => console.error(error),
            onReady: () => {}
          }
        }
      );
    };
    window.checkoutButton =  renderComponent(bricksBuilder);
  }