const express = require("express"); // un framework express
const app = express();
const cors = require("cors"); // un framework para evitar problemas con el navegador
const path = require("path"); // para levantar el html dedl cliente

const mercadopago = require("mercadopago"); // framework mercado pago

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: "	TEST-4479857435104661-052217-57a19be8d0e56ca6ca6ff792aeb8a2e7-1380800262", // se agrega el token de mercado pago
});

// utiliza los framework de seguridad 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client"))); //que mande bien a los archivos del cliente
app.use(cors());


app.get("/", function (req, res) {
	const filePath = path.resolve(__dirname, ".." , "client" , "index.html" ) // ejecuta la ruta principal de nuestra aplicacion
	es.sendFile(filePath)
});

// la publicacion/elproducto
app.post("/create_preference", (req, res) => {

	let preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			}
		],
		back_urls: { //a donde va el usuario al interatuar con la pagina
			"success": "http://localhost:8080", // el pago realizado
			"failure": "http://localhost:8080", // fallo en el pago
			"pending": "" // cuando el pago esta pendiente
		},
		auto_return: "approved", // pago aprobado
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id //acceder datos del producto
			});
		}).catch(function (error) {
			console.log(error);// manejode errores
		});
});

// para hacer mas configuraciones en base a las notificaciones
app.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

// levanta el servidor y retorna el servidor
app.listen(8080, () => {
	console.log("The server is now running on Port 8080");
});