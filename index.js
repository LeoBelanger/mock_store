// Require dependencies
var path = require('path');
var express = require('express');
var StoreDB = require('./StoreDB');
var db = new StoreDB('mongodb://127.0.0.1:27017', 'cpen400a-bookstore');

// Declare application parameters
var PORT = process.env.PORT || 3000;
var STATIC_ROOT = path.resolve(__dirname, './public');

// Defining CORS middleware to enable CORS.
// (should really be using "express-cors",
// but this function is provided to show what is really going on when we say "we enable CORS")
function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
  	next();
}

// Instantiate an express.js application
var app = express();

// Configure the app to use a bunch of middlewares
app.use(express.json());							// handles JSON payload
app.use(express.urlencoded({ extended : true }));	// handles URL encoded payload
app.use(cors);										// Enable CORS

app.use('/', express.static(STATIC_ROOT));			// Serve STATIC_ROOT at URL "/" as a static resource

// Configure '/products' endpoint
app.get('/products', function(request, response) {
	var query = request.query;
	var productsPromise = db.getProducts(query);
	
	productsPromise.then(function(result) {  
		response.status(200).send(JSON.stringify(result));
	}, function(err) {
		console.log("ERROR:", err);
		response.status(500).send(err); 
	});
});

app.post('/checkout', function(request, response) {
	var order = request.body;


	if (order.client_id == null || order.client_id == undefined || typeof(order.client_id) !== "string") {
		response.status(500).send("error");
	}
	
	if (order.cart == null || order.cart == undefined) {
		response.status(500).send("error");
	}
	
	if (order.total == null || order.total == undefined || typeof(order.total) !== "number") {
		response.status(500).send("error");
	} 

	
	var orderPromise = db.addOrder(order);
	
	orderPromise.then(function(result) {
		response.status(200).send(JSON.stringify(result));
	}, function (err) {
		console.log("Error: ", err);
		response.status(500).send(err);
	});
});

// Start listening on TCP port
app.listen(PORT, function(){
    console.log('Express.js server started, listening on PORT '+PORT);
});